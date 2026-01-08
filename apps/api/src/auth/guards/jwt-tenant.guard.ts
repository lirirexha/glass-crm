import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import type { Request } from 'express'

@Injectable()
export class JwtTenantGuard implements CanActivate {
  constructor(private readonly jwt: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>()

    const auth = req.headers.authorization
    if (!auth?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing token')
    }

    const token = auth.slice(7)

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
