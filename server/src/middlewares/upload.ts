import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";

dotenv.config();




export interface MulterFileWithCloudinary extends Express.Multer.File {
  cloudinaryUrl?: string;
}


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only .pdf, .doc, and .docx formats are allowed"));
  }
};

export const upload = multer({ storage, fileFilter });


export const uploadToCloudinary = (req: Request, res: Response, next: NextFunction) => {
  if (!req.file) return next();

  const stream = cloudinary.uploader.upload_stream(
    { folder: "resumes" },
    (error, result) => {
      if (error) return next(error);
      (req.file as MulterFileWithCloudinary).cloudinaryUrl = result?.secure_url;
      next();
    }
  );

  streamifier.createReadStream(req.file.buffer).pipe(stream);
};