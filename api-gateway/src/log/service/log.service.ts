// log.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Log } from '../entity/log.entity';

@Injectable()
export class LogService {
  constructor(@InjectModel(Log.name) private readonly logModel: Model<Log>) {}

  private async log(level: string, message: string, meta: any = {}) {
    const logEntry = new this.logModel({
      level,
      message,
      meta,
      timestamp: new Date(),
    });
    return logEntry.save();
  }

  async info(message: string, meta: any = {}) {
    return this.log('info', message, meta);
  }

  async error(message: string, meta: any = {}) {
    return this.log('error', message, meta);
  }

  async warn(message: string, meta: any = {}) {
    return this.log('warn', message, meta);
  }

  async debug(message: string, meta: any = {}) {
    return this.log('debug', message, meta);
  }


  async getLogs(filter: any) {
    const query: any = {};

    // Add filtering by log level if provided
    if (filter.level) {
      query['level'] = filter.level;
    }

    // Add filtering by date range if provided
    if (filter.startDate && filter.endDate) {
      query['timestamp'] = {
        $gte: new Date(filter.startDate),
        $lte: new Date(filter.endDate),
      };
    }

    // Add filtering by message content if provided
    if (filter.message) {
      query['message'] = { $regex: filter.message, $options: 'i' }; // Case-insensitive search
    }

    // Add filtering by meta fields if provided
    if (filter.metaKey && filter.metaValue) {
      query[`meta.${filter.metaKey}`] = { $regex: filter.metaValue, $options: 'i' };
    }

    return this.logModel.find(query).exec();
    // throw new Error('Method not implemented.');
  }

}
