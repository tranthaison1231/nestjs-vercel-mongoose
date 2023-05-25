import { IsMongoId } from 'class-validator';

export class IDValidator {
  @IsMongoId()
  id: string;
}
