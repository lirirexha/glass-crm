import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export type CurrentUserPayload = {
  sub: number
  companyId: number
  role: string
}

export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext): CurrentUserPayload => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  }
)
