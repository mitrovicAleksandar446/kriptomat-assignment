import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseFilters,
} from '@nestjs/common';
import { UniqueViolationExceptionFilter } from '../../../components/exception-filters/unique-violation-exception.filter';
import UserResourceService from '../../user/services/user-resource.service';
import LoginUserInput from '../inputs/login-user.input';
import RegisterUserInput from '../inputs/register-user.input';
import JwtIssuerService from '../services/jwt-issuer.service';

@Controller('/auth')
export default class AuthenticatorController {
  constructor(
    private readonly userResourceService: UserResourceService,
    private readonly jwtIssuerService: JwtIssuerService,
  ) {}

  @Post('register')
  @UseFilters(new UniqueViolationExceptionFilter('Email is already occupied'))
  @HttpCode(HttpStatus.CREATED)
  public async register(@Body() userInput: RegisterUserInput) {
    const user = await this.userResourceService.persistUser(userInput);

    const jwt = await this.jwtIssuerService.issueFor(user);

    return { accessToken: jwt };
  }

  @Post('login')
  public async login(@Body() loginInput: LoginUserInput) {
    const user = await this.userResourceService.findForLoginOrFail(loginInput);

    const jwt = await this.jwtIssuerService.issueFor(user);

    return { accessToken: jwt };
  }
}
