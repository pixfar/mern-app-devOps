import { Injectable } from '@nestjs/common';
import { unlink } from 'fs/promises';
import { join } from 'path';

@Injectable()
export class ResourceDeleteService {
  async delete(path: string): Promise<any> {
    try {
      // Path Validation Check
      const pathExpression = new RegExp('uploads/', 'i');
      if (!pathExpression.test(path)) {
        throw new Error('Resource delete Permission denied!');
      }
      
      await unlink(path);
      return true;
    } catch (error: any) {
      throw error;
    }
  }
}