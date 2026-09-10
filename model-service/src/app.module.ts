import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { getDefaultDbConnectionString } from './common/constants/mongoose.connection';
import { LawModule } from './law/law.module';

@Module({
  imports: [
    MongooseModule.forRoot(getDefaultDbConnectionString()),
    LawModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
