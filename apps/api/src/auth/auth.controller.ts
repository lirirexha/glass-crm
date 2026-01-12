import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import type { Request } from 'express'
import { AuthService } from './auth.service'
import { JwtTenantGuard } from './guards/jwt-tenant.guard'
import { RolesGuard } from './guards/roles.guard'
import { Roles } from './decorators/roles.decorator'
import { Role } from '@prisma/client'
import { Public } from './decorators/public.decorator'

class LoginDto {
  email!: string
  password!: string
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //TODO: To be discussed
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @Public()
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password)
  }

  @UseGuards(JwtTenantGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('me')
  me(@Req() req: Request) {
    const user = (req as any).user

    return {
      id: user.sub,
      companyId: user.companyId,
      role: user.role,
    }
  }
}
