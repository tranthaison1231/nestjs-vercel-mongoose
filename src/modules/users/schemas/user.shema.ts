import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  @ApiProperty({ example: 'Tom' })
  name: string;

  @Prop()
  @ApiProperty({ example: 1, description: 'The age of the Cat' })
  age: number;
}

export const UserSchema = SchemaFactory.createForClass(User);
