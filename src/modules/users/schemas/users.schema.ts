import { Event } from '@/modules/events/events.schema';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument, Types } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  @ApiProperty({ example: 'Tom' })
  name: string;

  @Prop({
    required: true,
    unique: true,
    type: String,
  })
  @ApiProperty({ example: 'tom@gmail.com' })
  email: string;

  @Prop()
  password: string;

  @Prop()
  avatarURL: string;

  @Prop()
  salt: string;

  @Prop({
    default: false,
  })
  isVerified: boolean;

  @Prop({ type: [Types.ObjectId], ref: 'Event' })
  events: Event[];
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: function (_doc, ret) {
    delete ret.password;
    delete ret.salt;
    return ret;
  },
});
