import { ExecutionContext, CanActivate } from '@nestjs/common';

// returns 403 status code if user is not authenticated
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    return request.session.userId;
  }
}
