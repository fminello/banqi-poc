import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { User as UserModel } from '@prisma/client';

@Controller({
  path: 'user',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('')
  async signupUser(
    @Body() userData: { name?: string; email: string },
  ): Promise<UserModel> {
    return this.userService.createUser(userData);
  }
}
