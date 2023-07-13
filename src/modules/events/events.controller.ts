import { JwtAuthGuard } from '@/shared/guards/jwt.guard';
import { LoggingInterceptor } from '@/shared/interceptors/logging.interceptor';
import {
  Controller,
  Get,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EventsService } from './events.service';

@ApiTags('events')
@Controller('events')
@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggingInterceptor)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  async findByID(@Param('id') id: string) {
    return this.eventsService.findById(id);
  }
}
