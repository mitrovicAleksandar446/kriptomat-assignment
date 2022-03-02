import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import LoginUserInput from '../../authenticator/inputs/login-user.input';
import RegisterUserInput from '../../authenticator/inputs/register-user.input';
import { User } from '../entities/user.entity';
import UpdatePasswordInput from '../inputs/update-password.input';
import UpdateUserInput from '../inputs/update-user.input';
import UserRepository from '../repositories/user.repository';

@Injectable()
export default class UserResourceService {
  constructor(private readonly userRepository: UserRepository) {}

  public async persistUser(userInput: RegisterUserInput): Promise<User> {
    const user = await User.buildFrom(userInput);

    await this.userRepository.persistAndFlush(user);

    return user;
  }

  public async findForLoginOrFail(loginUserInput: LoginUserInput): Promise<User> {
    const { email, password } = loginUserInput;
    const user = await this.userRepository.findOne({ email });

    if (!user || !(await user.verifyPassword(password))) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  public async updateUser(updateUserInput: UpdateUserInput, uuid: string): Promise<User> {
    const user = await this.userRepository.findOne({ uuid });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    user.fill(updateUserInput);

    await this.userRepository.persistAndFlush(user);

    return user;
  }

  async updateUserPassword(updatePasswordInput: UpdatePasswordInput, uuid: string): Promise<void> {
    const user = await this.userRepository.findOne({ uuid });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const { oldPassword, newPassword } = updatePasswordInput;

    if (!(await user.verifyPassword(oldPassword))) {
      throw new HttpException('Incorrect password', HttpStatus.BAD_REQUEST);
    }

    await user.setPassword(newPassword);
    await this.userRepository.persistAndFlush(user);
  }
}
