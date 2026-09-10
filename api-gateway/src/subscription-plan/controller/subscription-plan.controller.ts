import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/common/decorators';
import { UserRole } from 'src/common/enum';
import { AuthGuard, RolesGuard } from 'src/common/guard';
import { CreateSubscriptionPlanDto } from '../dto/create-subscription-plan.dto';
import { UpdateSubscriptionPlanDto } from '../dto/update-subscription-plan.dto';
import { SubscriptionPlanService } from '../service/subscription-plan.service';


@Controller('subscription-plan')
@ApiTags("Subscription Plan")
export class SubscriptionPlanController {
  constructor(private readonly subscriptionPlanService: SubscriptionPlanService) { }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Post()
  @Roles(UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  async create(@Body() createSubscriptionPlanDto: CreateSubscriptionPlanDto) {
    return await this.subscriptionPlanService.create(createSubscriptionPlanDto);
  }

  @Get()
  findAllPublic() {
    return this.subscriptionPlanService.findAll();
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  @Get("list")
  findAll() {
    return this.subscriptionPlanService.findAll({ isPublic: false });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subscriptionPlanService.findOne(id);
  }


  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard) @Patch(':id')
  @Roles(UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  update(@Param('id') id: string, @Body() updateSubscriptionPlanDto: UpdateSubscriptionPlanDto) {
    return this.subscriptionPlanService.update(id, updateSubscriptionPlanDto);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard, RolesGuard)
  @Delete(':id')
  @Roles(UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  remove(@Param('id') id: string) {
    return this.subscriptionPlanService.remove(id);
  }
}
