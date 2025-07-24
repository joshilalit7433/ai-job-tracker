import fs from "fs";
import path from "path";
import mammoth from "mammoth";
import * as pdfModule from "pdf-parse";

const pdfParse = pdfModule.default || pdfModule;

export const extractResumeText = async (filePath) => {
  const ext = path.extname(filePath).toLowerCase();
  const buffer = fs.readFileSync(filePath);

  if (ext === ".docx") {
    const { value } = await mammoth.extractRawText({ buffer });
    return value;
  } else if (ext === ".pdf") {
    const data = await pdfParse(buffer);
    return data.text;
  } else {
    throw new Error("Unsupported resume format. Only .docx and .pdf are supported.");
  }
};
