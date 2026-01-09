import {
  CanActivate,
  ExecutionContext,
  Injectable,
} from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'
import { ROLES_KEY } from '../decorators/roles.decorator'
import type { Role } from '@prisma/client'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ])

    // if no roles, allow
    if (!requiredRoles || requiredRoles.length === 0) return true

    const req = context.switchToHttp().getRequest<Request>()
    const user = (req as any).user as { role?: Role } | undefined

    if (!user?.role) {
      throw new Error('Missing user role')
    }

    if (!requiredRoles.includes(user.role)) {
      throw new Error('invalid role')
    }

    return true
  }
}
