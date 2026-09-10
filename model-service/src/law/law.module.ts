import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Law, LawSchema } from './entity/law.entity';
import { LawController } from './law.controller';
import { LawService } from './law.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Law.name, schema: LawSchema }]),
  ],
  controllers: [LawController],
  providers: [LawService],
})
export class LawModule { }
