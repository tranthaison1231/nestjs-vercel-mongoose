import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

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
  salt: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
