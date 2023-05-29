import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { LoggingInterceptor } from '../../shared/interceptors/logging.interceptor';
import { User } from '../../shared/decorators/user.decorator';
import { UsersService } from './users.service';
import { User as UserEntity } from './schemas/user.shema';

@ApiTags('users')
@Controller('users')
@UseGuards(RolesGuard)
@UseInterceptors(LoggingInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Get user by ID',
  })
  async findOne(@User() user: UserEntity) {
    console.log(user);
  }
}
