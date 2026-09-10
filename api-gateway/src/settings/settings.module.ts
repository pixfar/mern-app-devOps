import { Global, Module } from '@nestjs/common';
import { SettingsService } from './services/settings.service';
import { SettingsController } from './controllers/settings.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Setting, SettingSchema } from './entities/setting.entity';
import { SettingsImagesUploadModule } from 'src/common/module/file-upload/settings-images-upload.module';


@Global()
@Module({
  imports:[
    MongooseModule.forFeature([{ name: Setting.name, schema: SettingSchema }]),
    SettingsImagesUploadModule
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
