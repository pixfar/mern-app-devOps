import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { LogService } from 'src/log/service/log.service';
import { User } from 'src/user/entities/user.entity';


@Injectable()
export class TokenValidationMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
    private readonly logger: LogService,
  ) { }

  async use(req: Request, res: Response, next: NextFunction) {
    try{

      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new UnauthorizedException('No token provided');
      }
  
      const token = authHeader.split(' ')[1];
      const decoded = this.jwtService.verify(token);
  
      const user = await this.userModel.findById(decoded.sub).select("+currentToken").exec();
      if (!user.isActive) {
        throw new UnauthorizedException('User has been deactivated');
      }
      if (!user || user.currentToken !== token) {
        throw new UnauthorizedException('Invalid token');
      }
  
      next();
    }catch(error){
      this.logger.error("token-validation-middleware", error);
      next(error);
    }
  }
}
