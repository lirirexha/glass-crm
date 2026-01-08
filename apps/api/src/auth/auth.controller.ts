import { Body, Controller, Post } from '@nestjs/common'
import { Throttle } from '@nestjs/throttler'
import { AuthService } from './auth.service'

class LoginDto {
  email!: string
  password!: string
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  //TODO: To be discussed
  @Throttle({ default: { limit: 5, ttl: 60 } })
  @Post('login')
  login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password)
  }
}
