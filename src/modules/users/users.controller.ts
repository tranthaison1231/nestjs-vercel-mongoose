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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '@/shared/guards/jwt.guard';
import { LoggingInterceptor } from '@/shared/interceptors/logging.interceptor';
import { UsersService } from './users.service';
import { EventsService } from '../events/events.service';
import { CreateEventDto } from '../events/dto/events-payload.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventsService: EventsService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Get list users',
  })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by id',
  })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOneById(id);
  }

  @Get(':userId/events')
  @ApiOperation({
    summary: 'Get user by id',
  })
  @Get()
  async findAllEvents(@Param('userId') userId: string) {
    return this.eventsService.findBy(userId);
  }

  @Post(':userId/events')
  async create(
    @Param('userId') userId: string,
    @Body(ValidationPipe) createEventDto: CreateEventDto,
  ) {
    return this.eventsService.createBy(userId, createEventDto);
  }
}
