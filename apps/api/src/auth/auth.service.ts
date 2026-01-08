import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as argon2 from 'argon2'
import { PrismaService } from '../prisma/prisma.service'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService
  ) {}

  async login(email: string, password: string) {
    const userEmail = email.trim().toLowerCase()

    const user = await this.prisma.user.findUnique({
      where: { email: userEmail },
      select: {
        id: true,
        companyId: true,
        isActive: true,
        passwordHash: true
      }
    })

    if (!user || !user.isActive) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const ok = await argon2.verify(user.passwordHash, password)
    if (!ok) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // TODO: maybe change this one later if this service is used for client portal
    const payload = {
      sub: user.id,
      companyId: user.companyId,
      role: 'ADMIN', 
    }

    const accessToken = await this.jwt.signAsync(payload)

    return {
      accessToken,
      user: {
        id: user.id,
        email: userEmail,
        role: 'ADMIN',
        companyId: user.companyId,
      },
    }
  }
}
