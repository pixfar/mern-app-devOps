import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import { Model } from 'mongoose';
import * as path from 'path';
import { uploadDir } from 'src/common/utils/upload-dir';
import { UpdateSettingDto } from '../dto/update-setting.dto';
import { Setting } from '../entities/setting.entity';

@Injectable()
export class SettingsService {

  constructor(
    @InjectModel(Setting.name) private settingModel: Model<Setting>,
  ) { }

  async getSettings(): Promise<Setting> {
    const settings = await this.settingModel.findOne().exec();
    if (!settings) {
      const defaultSettings = new this.settingModel({
        creditPrice: 3,
        purchaseTaxPercentage: 20,
        logo: '',
        appName: '',
        primaryColor: '',
        secondaryColor: '',
        maintenanceMode: false,
        privacyPolicy: '',
        termsOfService: '',
        maxUploadSize: 50000
      });
      return defaultSettings;
    }
    return settings;
  }

  async updateSettings(updateSettingDto: UpdateSettingDto): Promise<Setting> {
    // Remove undefined properties from updateSettingDto
    Object.keys(updateSettingDto).map(key => {
      if (updateSettingDto[key] === undefined || updateSettingDto[key] == "") {
        delete updateSettingDto[key];
      }
    });

    if (updateSettingDto.logo) {
      let existingLogo = (await this.settingModel.findOne().exec()).logo;
      if (existingLogo) {
        let resolvedPath = path.resolve(uploadDir(), "settings", existingLogo);
        if (fs.existsSync(resolvedPath)) {
          fs.unlinkSync(resolvedPath);
        }
      }
    }

    const updatedSettings = await this.settingModel.findOneAndUpdate(
      {},
      { $set: updateSettingDto },
      { new: true, upsert: true }
    ).exec();

    if (!updatedSettings) {
      throw new NotFoundException('Failed to update settings');
    }

    return updatedSettings;
  }
}
