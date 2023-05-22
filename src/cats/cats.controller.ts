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

@Controller('cats')
export class CatsController {
  constructor(private readonly catsService: CatsService) {}

  @Post()
  async create(@Body() createCatDto: CreateCatDto) {
    await this.catsService.create(createCatDto);
  }

  @Get()
  async findAll(@Query() filterDto: GetCatsFilterDto): Promise<Cat[]> {
    return this.catsService.findAll(filterDto);
  }

  @Get(':id')
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
  async delete(@Param('id') id: string) {
    return this.catsService.delete(id);
  }
}
