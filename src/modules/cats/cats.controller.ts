import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './schemas/cat.schema';
import { GetCatsFilterDto } from './dto/get-cats-filter.dto';
import {
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { IDValidator } from '../../shared/validators.ts/id.validator';
import { RolesGuard } from '../../shared/guards/roles.guard';
import { LoggingInterceptor } from '../../shared/interceptors/logging.interceptor';

@ApiTags('cats')
@Controller('cats')
@UseGuards(RolesGuard)
@UseInterceptors(LoggingInterceptor)
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @ApiOperation({ summary: 'Create cat' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createCatDto: CreateCatDto) {
    await this.catsService.create(createCatDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get list of cat' })
  @ApiQuery({ name: 'name', example: 'Tom' })
  @ApiQuery({ name: 'age', example: '20' })
  @ApiQuery({ name: 'breed', example: 'Jerry' })
  async findAll(@Query() filterDto: GetCatsFilterDto): Promise<Cat[]> {
    return this.catsService.findAll(filterDto);
  }

  @Get(':id')
  @ApiParam({ name: 'id', example: 'SPOT-0000' })
  @ApiOperation({
    summary: 'Get cat by ID',
  })
  async findOne(@Param('id') id: string): Promise<Cat> {
    return this.catsService.findOne(id);
  }

  @Put(':id')
  async edit(
    @Param('id') id: string,
    @Body() createCatDto: CreateCatDto,
  ): Promise<Cat> {
    return this.catsService.edit(id, createCatDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: IDValidator) {
    return this.catsService.delete(id);
  }
}
