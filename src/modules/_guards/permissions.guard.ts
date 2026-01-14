import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth/auth.service';
import { PERMISSIONS_KEY } from '../_decorators/permissions.decorator';
import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from '@nestjs/common';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(private reflector: Reflector, private authService: AuthService) { }

  canActivate(context: ExecutionContext): boolean {
    const requiredPermissions = this.reflector.get<string[]>(PERMISSIONS_KEY, context.getHandler());
    const request = context.switchToHttp().getRequest();
    if (!requiredPermissions) return true;
    const user = request.user;
    const hasPermission = requiredPermissions.every((permission) => user?.permissions.includes(permission));
    if (!hasPermission) throw new ForbiddenException('Forbidden');
    return true;
  }
}
