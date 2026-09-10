// log.controller.ts
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { LogService } from '../service/log.service';
import { ApiTags, ApiQuery, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard, RolesGuard } from 'src/common/guard';
import { Roles } from 'src/common/decorators';
import { UserRole } from 'src/common/enum';

@Controller('logs')
@ApiTags('Logs')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class LogController {
  constructor(private readonly logService: LogService) {}

  @Get()
  @Roles(UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  @ApiQuery({ name: 'level', required: false })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'message', required: false })
  @ApiQuery({ name: 'metaKey', required: false })
  @ApiQuery({ name: 'metaValue', required: false })
  async getLogs(
    @Query('level') level?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('message') message?: string,
    @Query('metaKey') metaKey?: string,
    @Query('metaValue') metaValue?: string,
  ) {
    const filter = {
      level,
      startDate,
      endDate,
      message,
      metaKey,
      metaValue,
    };

    return await this.logService.getLogs(filter);
  }
}
