import { Controller, Get, ServiceUnavailableException } from '@nestjs/common'
import { Public } from '../auth/decorators/public.decorator'
import { PrismaService } from '../prisma/prisma.service'

@Public()
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  async health() {
    const startedAt = Date.now()

    try {
      await this.prisma.$queryRaw`SELECT 1`

      return {
        status: 'ok',
        db: 'up',
        uptimeSec: Math.floor(process.uptime()),
        responseTimeMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
      }
    } catch {
      throw new ServiceUnavailableException({
        status: 'degraded',
        db: 'down',
        uptimeSec: Math.floor(process.uptime()),
        responseTimeMs: Date.now() - startedAt,
        timestamp: new Date().toISOString(),
        message: 'Database unreachable',
      })
    }
  }
}
