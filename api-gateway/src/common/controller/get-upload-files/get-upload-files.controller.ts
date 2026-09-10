import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

@Controller('uploads')
@ApiTags('Get Upload Files')
export class GetUploadFilesController {
  @Get('user-profile-image/:filename')
  async getUserProfileImage(@Param('filename') filename, @Res() res: Response) {
    res.sendFile(filename, { root: './uploads/user-profile-image' });
  }

  @Get('settings/:filename')
  async getSurprisedBucketImage(
    @Param('filename') filename,
    @Res() res: Response,
  ) {
    res.sendFile(filename, {
      root: './uploads/settings',
    });
  }
}
