import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { UserProfileImageUploadModule } from '../common/module';
import { ResourceDeleteModule } from '../common/module/resource-delete/resource-delete.module';
import { UserController } from './controller/user.controller';
import { Initialization, InitializationSchema } from './entities/initialization.entity';
import { User, UserSchema } from './entities/user.entity';
import { UserService } from './service/user.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Initialization.name, schema: InitializationSchema }
    ]),
    UserProfileImageUploadModule,
    ResourceDeleteModule,
    forwardRef(() => SubscriptionModule)
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService, MongooseModule],
})
export class UserModule { }
