import { IsNotEmpty, IsString } from 'class-validator';

interface CleanUser {
  username: string;
  id: string;
  role: string;
  tasks: object[];
}
export class SignUpDto {
  @IsNotEmpty()
  user: CleanUser;

  @IsNotEmpty()
  @IsString()
  access_token: string;
}
