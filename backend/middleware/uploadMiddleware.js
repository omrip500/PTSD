import multer from "multer";
import multerS3 from "multer-s3";
import s3 from "../config/s3.js";
import { v4 as uuidv4 } from "uuid";
import path from "path";

const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      cb(null, `datasets/${uuidv4()}${ext}`);
    },
  }),
});

export default upload;
