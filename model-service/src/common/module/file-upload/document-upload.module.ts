// file-upload.module.ts
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: './temp',
        filename: (req, file, cb) => {
          const uniquePrefix = uuidv4();
          const pdfName = `${uniquePrefix}--${file.originalname}`;
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
    }),
  ],
  exports: [MulterModule],
})
export class DocumentUploadModule { }
