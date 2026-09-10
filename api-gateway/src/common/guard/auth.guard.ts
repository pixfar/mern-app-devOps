import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ModuleRef, Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import {
  CoreConfigService,
  JWT_SECRECT_KEY,
} from '../config/core/core.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { UserService } from 'src/user/service/user.service';
import { Types } from 'mongoose';

@Injectable()
export class AuthGuard implements CanActivate {
  private userService: UserService;

  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private moduleRef: ModuleRef
  ) { }

  async onModuleInit() {
    this.userService = await this.moduleRef.get(UserService, { strict: false });
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const config = new CoreConfigService();
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      // 💡 See this condition
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException();
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: config.get(JWT_SECRECT_KEY),
      });

      const user = await this.userService.findById(new Types.ObjectId(payload.sub));
      if (!user || !user.isActive) {
        throw new UnauthorizedException(user ? 'User account is inactive' : 'User not found');
      }

      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
