import { Controller, Get, Patch, Body, UseGuards, UseInterceptors, UploadedFile, UsePipes, Param, Res } from '@nestjs/common';
import { SettingsService } from '../services/settings.service';
import { UpdateSettingDto } from '../dto/update-setting.dto';
import { AuthGuard, RolesGuard } from 'src/common/guard';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators';
import { UserRole } from 'src/common/enum';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('settings')
@ApiTags('Settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) { }

  @Get()
  getSettings() {
    return this.settingsService.getSettings();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  @ApiConsumes('multipart/form-data')
  @Patch()
  @UseInterceptors(
    FileInterceptor('logo'),
  )
  updateSettings(
    @Body() updateSettingDto: UpdateSettingDto,
    @UploadedFile() logo: Express.Multer.File,
  ) {
    updateSettingDto["logo"] = logo?.filename ? logo?.filename : "";
    return this.settingsService.updateSettings(updateSettingDto);
  }
}
