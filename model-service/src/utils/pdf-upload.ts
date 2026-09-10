import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

export const multerOptions = (uniquefyPdfName: boolean) => ({
  storage: diskStorage({
    destination: './temp',
    filename: (req, file, cb) => {
      const uniquePrefix = uuidv4();
      const pdfName = uniquefyPdfName ? `${uniquePrefix}-${file.originalname}` : file.originalname;
      cb(null, pdfName);
    },
  }),
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB limit
  }
});
