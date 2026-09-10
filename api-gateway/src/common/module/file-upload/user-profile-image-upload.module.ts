import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer'; // Use memory storage instead of disk storage

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(), // Store files in memory for compression
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(new Error('Only image files are allowed!'), false); // Reject non-image files
        }
      },
    }),
  ],
  exports: [MulterModule],
})
export class UserProfileImageUploadModule { }
