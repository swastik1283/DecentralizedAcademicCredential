import Jimp from "jimp";

// your fixed seal bounding box
export const sealBBox = {
    x: 1400,
    y: 90,
    w: 450,
    h: 450
};

export const cropSealFromUpload = async (uploadedPath) => {
    const img = await Jimp.read(uploadedPath);
    const { x, y, w, h } = sealBBox;

    const cropped = img.crop(x, y, w, h);
    const outputPath = uploadedPath + "_seal.png";

    await cropped.writeAsync(outputPath);
    return outputPath;
};
