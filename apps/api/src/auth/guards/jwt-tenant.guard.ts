import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Reflector } from '@nestjs/core'
import type { Request } from 'express'
import { IS_PUBLIC_KEY } from '../decorators/public.decorator'

@Injectable()
export class JwtTenantGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly reflector: Reflector
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (isPublic) return true

    const req = context.switchToHttp().getRequest<Request>()

    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token')
    }

    const token = auth.slice(7).trim()

    let payload: any
    try {
      payload = await this.jwt.verifyAsync(token)
    } catch {
      throw new UnauthorizedException('Invalid token')
    }

    const companyHeader = req.headers['x-company-id']
    const companyId = Number(companyHeader)

    if (!companyId || companyId !== payload.companyId) {
      throw new UnauthorizedException('Invalid company')
    }
    ;(req as any).user = payload
    
    return true
  }
}
