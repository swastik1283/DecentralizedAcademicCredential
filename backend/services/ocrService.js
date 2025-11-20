import Tesseract from "tesseract.js";

export const extractText=async(imagePath)=>{
    const result=await Tesseract.recognize(imagePath,"eng")
    return result.data.text
}