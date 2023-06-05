import { ApiProperty } from '@nestjs/swagger';

export class TokenPayloadDto {
  @ApiProperty()
  expiresIn: number;

  @ApiProperty()
  tokenType: string;

  @ApiProperty()
  accessToken: string;

  constructor(data: {
    expiresIn: number;
    accessToken: string;
    tokenType: string;
  }) {
    this.tokenType = data.tokenType;
    this.expiresIn = data.expiresIn;
    this.accessToken = data.accessToken;
  }
}
