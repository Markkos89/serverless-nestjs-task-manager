import { Body, Controller, Post } from '@nestjs/common';
import { SignUpDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  async signUp(@Body() body: AuthCredentialsDto): Promise<SignUpDto> {
    const user = await this.authService.signUp(body);
    if (user) {
      const { password, username, ...cleanUser } = body;
      const { password: pwd, ...cleanedUser } = user;

      const data = { username, password };
      const signedUp = await this.signIn(data);
      if (signedUp) {
        return { user: cleanedUser, access_token: signedUp.access_token };
      }
    }
  }

  @Post('/signin')
  signIn(@Body() body: AuthCredentialsDto): Promise<{ access_token: string }> {
    return this.authService.signIn(body);
  }
}
