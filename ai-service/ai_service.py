   #!/usr/bin/env python3
"""
ai_service.py

Usage (verify):
python ai_service.py --verify --uploaded /path/to/uploaded.png \
  --template /path/to/officialTemplate.png \
  --seal /path/to/officialSeal.png \
  --sig1 /path/to/officialSignature1.png

Outputs JSON to stdout with fields:
{ "layoutScore":..., "sealScore":..., "signatureScore":..., "finalScore":..., "details":{...} }
"""

import argparse
import json
import cv2
import numpy as np
from skimage.metrics import structural_similarity as ssim
from pathlib import Path
from typing import Tuple

# -------------------------
# Helpers
# -------------------------
def imread_rgb(path: str):
    img = cv2.imdecode(np.fromfile(path, dtype=np.uint8), cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError(f"Could not open image: {path}")
    return img

def resize_for_compare(img, width=800):
    h, w = img.shape[:2]
    if w == width:
        return img
    ratio = width / w
    new_h = int(h * ratio)
    return cv2.resize(img, (width, new_h), interpolation=cv2.INTER_AREA)

# -------------------------
# Layout similarity (SSIM)
# -------------------------
def layout_similarity(uploaded_path: str, template_path: str) -> float:
    a = imread_rgb(uploaded_path)
    b = imread_rgb(template_path)
    # convert to grayscale and resize to same width
    a_gray = cv2.cvtColor(resize_for_compare(a, width=1000), cv2.COLOR_BGR2GRAY)
    b_gray = cv2.cvtColor(resize_for_compare(b, width=1000), cv2.COLOR_BGR2GRAY)
    # ensure same shape
    if a_gray.shape != b_gray.shape:
        min_h = min(a_gray.shape[0], b_gray.shape[0])
        min_w = min(a_gray.shape[1], b_gray.shape[1])
        a_gray = a_gray[:min_h, :min_w]
        b_gray = b_gray[:min_h, :min_w]
    s = ssim(a_gray, b_gray)
    score = float(s * 100.0)
    return round(score, 2)

# -------------------------
# ORB feature matcher for seal/logo
# -------------------------
def crop_from_bbox(img, bbox: Tuple[int,int,int,int]):
    x, y, w, h = bbox
    h_img, w_img = img.shape[:2]
    # clamp bbox inside image
    x = max(0, min(x, w_img-1))
    y = max(0, min(y, h_img-1))
    w = max(1, min(w, w_img - x))
    h = max(1, min(h, h_img - y))
    return img[y:y+h, x:x+w]

def orb_match_score(img1, img2):
    # img1, img2 are BGR color images
    gray1 = cv2.cvtColor(img1, cv2.COLOR_BGR2GRAY)
    gray2 = cv2.cvtColor(img2, cv2.COLOR_BGR2GRAY)
    orb = cv2.ORB_create(nfeatures=1000)

    k1, d1 = orb.detectAndCompute(gray1, None)
    k2, d2 = orb.detectAndCompute(gray2, None)
    if d1 is None or d2 is None:
        return 0.0

    bf = cv2.BFMatcher(cv2.NORM_HAMMING, crossCheck=True)
    try:
        matches = bf.match(d1, d2)
    except cv2.error:
        return 0.0

    if len(matches) == 0:
        return 0.0

    # sort matches by distance (lower is better)
    matches = sorted(matches, key=lambda x: x.distance)
    # use good matches (distance threshold)
    good = [m for m in matches if m.distance < 60]  # threshold, tweak if needed
    # normalized by min keypoint count (so ratio is robust)
    denom = min(len(k1), len(k2), 100)
    score = (len(good) / denom) * 100.0
    # clamp
    return round(max(0.0, min(100.0, score)), 2)

# -------------------------
# Signature score (heuristic using ORB)
# -------------------------
def signature_score(uploaded_img, official_sig_img):
    # use orb_match_score on signature regions
    return orb_match_score(uploaded_img, official_sig_img)

# -------------------------
# Main verify pipeline
# -------------------------
def verify_certificate(uploaded_path, template_path, official_seal_path, seal_bbox=None, sig_bbox_list=None, sig_templates=None):
    out = {}
    # layout
    try:
        layout = layout_similarity(uploaded_path, template_path) if template_path else 0.0
    except Exception as e:
        layout = 0.0
        out['layout_error'] = str(e)

    out['layoutScore'] = layout

    # load uploaded image
    uploaded_img = imread_rgb(uploaded_path)

    # seal
    seal_score = 0.0
    if official_seal_path:
        seal_img = imread_rgb(official_seal_path)
        if seal_bbox:
            try:
                crop = crop_from_bbox(uploaded_img, seal_bbox)
                # if crop too small, scale it up a bit
                if crop.shape[0] < 10 or crop.shape[1] < 10:
                    seal_score = 0.0
                else:
                    seal_score = orb_match_score(crop, seal_img)
            except Exception as e:
                out['seal_error'] = str(e)
                seal_score = orb_match_score(uploaded_img, seal_img)
        else:
            seal_score = orb_match_score(uploaded_img, seal_img)
    out['sealScore'] = seal_score

    # signatures (if provided)
    signature_scores = []
    if sig_templates and sig_bbox_list:
        for i, sig_path in enumerate(sig_templates):
            try:
                sig_template = imread_rgb(sig_path)
                bbox = sig_bbox_list[i]
                crop_sig = crop_from_bbox(uploaded_img, bbox)
                sc = signature_score(crop_sig, sig_template)
                signature_scores.append(sc)
            except Exception as e:
                signature_scores.append(0.0)
                out.setdefault('signature_errors', []).append(str(e))
    # average signature score (if any)
    sig_score_avg = round(np.mean(signature_scores) if signature_scores else 0.0, 2)
    out['signatureScore'] = sig_score_avg

    # combine final AI confidence (weighted)
    final = 0.5*layout + 0.35*seal_score + 0.15*sig_score_avg
    out['finalScore'] = round(final, 2)

    # detailed
    out['details'] = {
        'layout': out['layoutScore'],
        'seal': out['sealScore'],
        'signature': out['signatureScore']
    }
    return out

# -------------------------
# CLI
# -------------------------
def parse_bbox(s):
    # format: x,y,w,h
    parts = s.split(",")
    return tuple(int(p.strip()) for p in parts)

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--verify", action="store_true")
    p.add_argument("--uploaded", required=True)
    p.add_argument("--template", required=False, default=None)
    p.add_argument("--seal", required=False, default=None)
    p.add_argument("--seal-bbox", required=False, default=None, help="bbox x,y,w,h")
    p.add_argument("--sig-bbox-list", required=False, default=None, help="semicolon-separated bboxes")
    p.add_argument("--sig-templates", required=False, default=None, help="semicolon-separated paths to signature templates")
    args = p.parse_args()

    if args.verify:
        seal_bbox = parse_bbox(args.seal_bbox) if args.seal_bbox else None
        sig_bbox_list = None
        sig_templates = None
        if args.sig_bbox_list:
            sig_bbox_list = [parse_bbox(x) for x in args.sig_bbox_list.split(";")]
        if args.sig_templates:
            sig_templates = args.sig_templates.split(";")

        result = verify_certificate(
            args.uploaded,
            args.template,
            args.seal,
            seal_bbox=seal_bbox,
            sig_bbox_list=sig_bbox_list,
            sig_templates=sig_templates
        )
        print(json.dumps(result))