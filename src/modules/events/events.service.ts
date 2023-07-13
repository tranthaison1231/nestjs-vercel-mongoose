import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Event, EventDocument } from './events.schema';
import { CreateEventDto } from './dto/events-payload.dto';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private readonly eventModel: Model<Event>,
  ) {}

  async findBy(userId: string): Promise<EventDocument[]> {
    return this.eventModel
      .find({
        user: userId,
      })
      .populate('user')
      .exec();
  }

  async findAll(): Promise<EventDocument[]> {
    return this.eventModel.find().populate('user').exec();
  }

  async findById(eventId): Promise<EventDocument[]> {
    return this.eventModel.findById(eventId).populate('user');
  }

  async createBy(
    userId: string,
    createEventDto: CreateEventDto,
  ): Promise<EventDocument> {
    return this.eventModel.create({
      ...createEventDto,
      user: userId,
    });
  }
}
