import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';
import { User } from '../users/schemas/users.schema';

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
  @Prop()
  @ApiProperty({ example: 'My birthday' })
  name: string;

  @Prop()
  startDate: Date;

  @Prop()
  endDate: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  user?: User;
}

export const EventsSchema = SchemaFactory.createForClass(Event);
