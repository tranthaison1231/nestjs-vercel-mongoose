import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err, user, info) {
    if (err || !user) {
      if (info) {
        throw new UnauthorizedException(info.message, {
          cause: err,
        });
      }
      throw new UnauthorizedException('Unauthorized', {
        cause: err,
      });
    }
    return user;
  }
}
