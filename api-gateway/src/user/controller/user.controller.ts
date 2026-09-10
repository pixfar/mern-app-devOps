import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { GetSessionUser } from 'src/common/decorators/session-user.decorator';
import { ImageCompressionInterceptor } from 'src/common/module/file-upload/interceptor/image-compress-interceptor';
import { Roles } from '../../common/decorators';
import { DataSearchDecorator } from '../../common/decorators/data-search.decorator';
import { UserRole } from '../../common/enum';
import { SortBy } from '../../common/enum/enum-sort-by';
import { RolesGuard } from '../../common/guard';
import { AuthGuard } from '../../common/guard/auth.guard';
import { ValidateDtoPipe } from '../../common/pipe/validate-dto.pipe';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UserService } from '../service/user.service';

@Controller('user')
@ApiTags('User')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get('list')
  @Roles(UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  @DataSearchDecorator([
    { name: 'startDate', type: Date, required: false, example: '2022-01-01' },
    { name: 'endDate', type: Date, required: false, example: '2025-02-01' },
  ])
  findAll(
    @Query('page') page: number,
    @Query('limit') limit: number,
    @Query('order') order: string,
    @Query('sort') sort: SortBy,
    @Query('search') search: string,
    @Query('fields') fields: string,
    @Query('startDate') startDate: Date,
    @Query('endDate') endDate: Date,
  ) {
    return this.userService.findAll(
      page,
      limit,
      order,
      sort,
      search,
      fields,
      startDate,
      endDate,
    );
  }

  @Get()
  @Roles(UserRole.USER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  @UsePipes(new ValidateDtoPipe())
  findMe(@GetSessionUser() user: any) {
    return this.userService.findOne(user?.sub);
  }

  @Get(':userId')
  @Roles(UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  @UsePipes(new ValidateDtoPipe())
  findOne(@Param('userId') userId: string) {
    return this.userService.findOne(userId);
  }

  @Patch()
  @Roles(UserRole.USER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('profileImage'),
    new ImageCompressionInterceptor(),
  )
  async updateSessionUser(
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() profileImage: Express.Multer.File,
    @GetSessionUser() user: any,
  ) {
    try {
      return this.userService.update(user?.sub, updateUserDto, profileImage);
    } catch (error) {
      throw error;
    }
  }

  @Patch(':userId')
  @Roles(UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  @UsePipes(new ValidateDtoPipe())
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('profileImage'),
    new ImageCompressionInterceptor()
  )
  async updateByAdmin(
    @Param('userId') user: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFile() profileImage: Express.Multer.File,

  ) {
    try {
      return this.userService.update(user, updateUserDto, profileImage);
    } catch (error) {
      throw error;
    }
  }

  @Delete(':userId')
  @Roles(UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
  @UsePipes(new ValidateDtoPipe())
  remove(@Param('userId') id: string) {
    return this.userService.remove(id);
  }
}
