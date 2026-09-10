import { forwardRef, Module } from '@nestjs/common';
import { RequestEventEmitterModule } from 'src/common/event-emitter/event-emitter.module';
import { JWTAuthModule } from '../../common/module/jwt/jwt.module';
import { UserModule } from '../../user/user.module';
import { AuthController } from './controller/auth.controller';
import { AuthService } from './service/auth.service';

@Module({
  imports: [
    JWTAuthModule,
    UserModule,
    forwardRef(() => RequestEventEmitterModule),],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule { }
