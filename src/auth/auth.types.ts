import { ApiProperty } from '@nestjs/swagger';

export class SignUpDto {
  @ApiProperty()
  name: string;

  @ApiProperty({ example: 'user@zapmail.io.vn' })
  address: string;

  @ApiProperty()
  password: string;
}

export class LoginDto {
  @ApiProperty({ example: 'user@zapmail.io.vn' })
  address: string;

  @ApiProperty()
  password: string;
}

export type UserDto = {
  id: string;
  name: string;
  address: string;
};
