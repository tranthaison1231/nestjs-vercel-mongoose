import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CatsService } from './cats.service';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './schemas/cat.schema';
import { GetCatsFilterDto } from './dto/get-cats-filter.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { IDValidator } from '../../shared/validators.ts/id.validator';

@ApiTags('cats')
@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  @ApiOperation({ summary: 'Create cat' })
  @ApiResponse({ status: 403, description: 'Forbidden.' })
  async create(@Body() createCatDto: CreateCatDto) {
    await this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(@Query() filterDto: GetCatsFilterDto): Promise<Cat[]> {
    return this.catsService.findAll(filterDto);
  }

  @Get(':id')
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: Cat,
  })
  async findOne(@Param('id') id: IDValidator): Promise<Cat> {
    return this.catsService.findOne(id);
  }

  @Put(':id')
  async edit(
    @Param('id') id: IDValidator,
    @Body() createCatDto: CreateCatDto,
  ): Promise<Cat> {
    return this.catsService.edit(id, createCatDto);
  }

  @Delete(':id')
  async delete(@Param('id') id: IDValidator) {
    return this.catsService.delete(id);
  }
}
