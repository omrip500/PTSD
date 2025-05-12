// backend/middleware/uploadTempMiddleware.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";

// יצירת תיקייה זמנית אם לא קיימת
const tempDir = path.join(process.cwd(), "backend", "temp_uploads");
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${uuidv4()}${ext}`);
  },
});

const upload = multer({ storage });
export default upload;
