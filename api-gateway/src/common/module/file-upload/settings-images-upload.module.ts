import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    MulterModule.register({
      storage: diskStorage({
        destination: function (req, file, cb) {
          const fs = require('fs')
          const uploadPath = './uploads/settings'
          fs.mkdirSync(uploadPath, { recursive: true })
          cb(null, uploadPath)
        },
        filename: function (req, file, cb) {
          cb(null, Date.now() + '-' + file.originalname.split(' ').join('-'))
        }
      }),
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false);
        }
      },
    }),
  ],
  exports: [MulterModule],
})
export class SettingsImagesUploadModule { }
