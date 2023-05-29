import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateCatDto } from './dto/create-cat.dto';
import { Cat } from './schemas/cat.schema';
import { GetCatsFilterDto } from './dto/get-cats-filter.dto';
import { IDValidator } from '../../shared/validators.ts/id.validator';

@Injectable()
export class CatsService {
  constructor(@InjectModel(Cat.name) private readonly catModel: Model<Cat>) {}

  async create(createCatDto: CreateCatDto): Promise<Cat> {
    const createdCat = await this.catModel.create(createCatDto);
    return createdCat;
  }

  async edit(id: string, createCatDto: CreateCatDto): Promise<Cat> {
    return this.catModel
      .findByIdAndUpdate(id, createCatDto, {
        new: true,
      })
      .exec();
  }

  async findAll({
    name,
    breed,
    ...filterDto
  }: GetCatsFilterDto): Promise<Cat[]> {
    return this.catModel
      .find({
        name: { $regex: name ?? '', $options: 'i' },
        breed: { $regex: breed ?? '', $options: 'i' },
        ...filterDto,
      })
      .exec();
  }

  async findOne(id: string): Promise<Cat> {
    return this.catModel.findById(id).exec();
  }

  async delete(id: IDValidator) {
    const deletedCat = await this.catModel
      .findByIdAndRemove({ _id: id })
      .exec();
    return deletedCat;
  }
}
