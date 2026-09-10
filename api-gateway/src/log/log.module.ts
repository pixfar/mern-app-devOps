// log.module.ts
import { Global, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LogService } from './service/log.service';
import { Log, LogSchema } from './entity/log.entity';
import { LogController } from './controller/log.controller';

@Global()
@Module({
    imports: [MongooseModule.forFeature([{ name: Log.name, schema: LogSchema }])],
    controllers: [LogController],
    providers: [LogService],
    exports: [LogService],
})
export class LogModule { }
