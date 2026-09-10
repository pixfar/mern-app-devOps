import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from '../service/dashboard.service';
// import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
// import { RolesGuard } from '../auth/guards/roles.guard';
// import { Roles } from '../auth/decorators/roles.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators';
import { AuthGuard, RolesGuard } from 'src/common/guard';
import { UserRole } from '../../common/enum';

@Controller('dashboard')
@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) { }

  @Get('analytics')
  @Roles(UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  async getDashboardAnalytics() {
    return this.dashboardService.getDashboardAnalytics();
  }
}