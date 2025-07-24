import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"uploads/resumes");
        
    },

    filename:function(req,file,cb){
        const ext =path.extname(file.originalname);
        cb(null,Date.now() +ext )
    },
});


const fileFilter = (req, file, cb) => {
    const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Only .pdf, .doc, and .docx formats are allowed"), false);
    }
  };

  export const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
  });