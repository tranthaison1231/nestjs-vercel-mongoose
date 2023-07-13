import { JwtAuthGuard } from '@/shared/guards/jwt.guard';
import { LoggingInterceptor } from '@/shared/interceptors/logging.interceptor';
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateEventDto } from './dto/events-payload.dto';
import { EventsService } from './events.service';

@ApiTags('events')
@Controller('users/:userId/events')
@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggingInterceptor)
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  async findAll(@Param('userId') userId: string) {
    return this.eventsService.findAll(userId);
  }

  @Get(':eventId')
  async findByID(@Param('eventId') eventId: string) {
    return this.eventsService.findById(eventId);
  }

  @Post()
  async create(
    @Param('userId') userId: string,
    @Body(ValidationPipe) createEventDto: CreateEventDto,
  ) {
    return this.eventsService.create(userId, createEventDto);
  }
}
