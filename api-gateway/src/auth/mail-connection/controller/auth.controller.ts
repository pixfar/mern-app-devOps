import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { Roles } from 'src/common/decorators';
import { GetSessionUser } from 'src/common/decorators/session-user.decorator';
import { UserRole } from 'src/common/enum';
import { AuthGuard } from '../../../common/guard/auth.guard';
import { ValidateDtoPipe } from '../../../common/pipe/validate-dto.pipe';
import { CreateUserDto } from '../../../user/dto/create-user.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { UserLoginDto } from '../dto/user-login.dto';
import { ValidateAndUpdateExistingPasswordDto } from '../dto/validate-and-update-existing-password.dto';
import { ValidateAndUpdatePasswordDto } from '../dto/validate-and-update-password.dto';
import { AuthService } from '../service/auth.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('/registration')
  @UsePipes(new ValidateDtoPipe())
  async registration(@Body() createUserData: CreateUserDto , @Req() request: Request) {
    const origin = request.get('origin');
    return await this.authService.registerUser(createUserData , origin);
  }

  @Post('verify-registration-mail/:token')
  @UsePipes(new ValidateDtoPipe())
  async verifyToken(@Param('token') token: string) {    
    return this.authService.verifyToken(token);
  }

  @Post('login')
  @UsePipes(new ValidateDtoPipe())
  login(@Body() userLoginDto: UserLoginDto) {
    return this.authService.login(userLoginDto);
  }

  @Post('forgot-password')
  @UsePipes(new ValidateDtoPipe())
  forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.authService.forgotPassword(forgotPasswordDto);
  }

  @Post('reset-password')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @UsePipes(new ValidateDtoPipe())
  async validateAndUpdatePassword(
    @Body() verificationData: ValidateAndUpdatePasswordDto,
    @Req() request: Request,
  ) {
    const validationData = verificationData;
    const userData: any = request['user'];
    return await this.authService.validateAndUpdatePassword(
      userData,
      validationData,
    );
  }

  @Post('update-existing-password')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.USER, UserRole.ADMINISTRATOR)
  @UsePipes(new ValidateDtoPipe())
  async updateExistingPassword(
    @Body() verificationData: ValidateAndUpdateExistingPasswordDto,
    @GetSessionUser() user: any
  ) {
    return await this.authService.updateExistingPassword(
      verificationData,
      user,
    );
  }

  @Post('logout')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Roles(UserRole.USER, UserRole.ADMINISTRATOR)
  @UsePipes(new ValidateDtoPipe())
  async logout(
    @GetSessionUser() user: any
  ) {
    return await this.authService.logout(user);
  }


}
