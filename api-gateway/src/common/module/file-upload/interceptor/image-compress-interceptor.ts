import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Observable } from 'rxjs';
import * as sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

interface CompressionOptions {
  size?: number;
  quality?: number;
}

@Injectable()
export class ImageCompressionInterceptor implements NestInterceptor {
  private size: number;
  private quality: number;

  constructor(options?: CompressionOptions) {
    this.size = options?.size || 1024;
    this.quality = options?.quality || 80;
  }

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const files: Express.Multer.File | Express.Multer.File[] = request.files || request.file;

    // Check if there are files to process
    if (!files) {
      console.warn('No files found in request');
      return next.handle();
    }

    // Process single or multiple files
    try {
      if (Array.isArray(files)) {
        let fileNames: string[] = [];
        for (const file of files) {
          let fileName = await this.compressAndStoreInMemory(file);
          fileNames.push(fileName);
        }
        request.files = fileNames;
      } else {
        let fileName = await this.compressAndStoreInMemory(files);
        request.file = fileName;
      }
    } catch (error) {
      throw new Error('Failed to process image files.');
    }

    // Continue to the next handler
    return next.handle();
  }

  private async compressAndStoreInMemory(file: Express.Multer.File): Promise<string> {
    if (!file || !file.buffer) {
      console.error('Invalid file or empty buffer');
      throw new Error('Invalid file or empty buffer');
    }

    try {
      // Ensure the buffer is not empty
      if (!file.buffer || file.buffer.length === 0) {
        console.error('Empty file buffer received for compression');
        throw new Error('Empty file buffer received for compression');
      }

      const buffer = await sharp(file.buffer)
        .resize(this.size)
        .jpeg({ quality: this.quality })
        .toBuffer();

      // Generate unique filename and destination path
      const destination = './uploads/user-profile-image/';
      const uniqueFilename = `${uuidv4()}-${Date.now()}-${file.originalname.split(' ').join('-')}`;
      const filePath = path.join(destination, uniqueFilename);

      // Ensure the destination directory exists
      if (!fs.existsSync(destination)) {
        fs.mkdirSync(destination, { recursive: true });
      }

      // Save compressed image to disk
      fs.writeFileSync(filePath, buffer);
      return uniqueFilename;
    } catch (error) {
      console.error('Error during image compression:', error);
      throw new Error('Image compression failed due to an invalid input');
    }
  }
}
