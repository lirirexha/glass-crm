import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import type { Request, Response } from 'express'

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const res = ctx.getResponse<Response>()
    const req = ctx.getRequest<Request>()

    const isHttp = exception instanceof HttpException
    const status = isHttp
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR

    const response = isHttp ? exception.getResponse() : null

    const message =
      typeof response === 'string'
        ? response
        : (response as any)?.message ?? 'Internal server error'

    const error =
      typeof response === 'object' && response !== null
        ? (response as any)?.error
        : undefined

    res.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: req.originalUrl,
      method: req.method,
      message,
      error,
    })
  }
}
