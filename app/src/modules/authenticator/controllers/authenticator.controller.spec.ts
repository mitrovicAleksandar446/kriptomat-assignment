import { Test } from '@nestjs/testing';
import { User } from '../../user/entities/user.entity';
import UserRepository from '../../user/repositories/user.repository';
import UserResourceService from '../../user/services/user-resource.service';
import LoginUserInput from '../inputs/login-user.input';
import RegisterUserInput from '../inputs/register-user.input';
import JwtIssuerService from '../services/jwt-issuer.service';
import AuthenticatorController from './authenticator.controller';

describe('AuthenticatorController', () => {
  let authenticatorController: AuthenticatorController;
  let userResourceService: UserResourceService;
  let jwtIssuerService: JwtIssuerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [AuthenticatorController],
      providers: [UserResourceService, JwtIssuerService, UserRepository],
    }).compile();

    userResourceService = module.get<UserResourceService>(UserResourceService);
    jwtIssuerService = module.get<JwtIssuerService>(JwtIssuerService);

    authenticatorController = module.get<AuthenticatorController>(
      AuthenticatorController,
    );
  });

  describe('#register', () => {
    it('should return access token', async () => {
      const registerUserInput: RegisterUserInput = {
        name: 'name',
        email: 'email@example.com',
        password: 'secret',
      };
      const result = { accessToken: 'jwt' };
      const user = await User.buildFrom(registerUserInput);

      jest
        .spyOn(jwtIssuerService, 'issueFor')
        .mockImplementation(() => Promise.resolve('jwt'));
      jest
        .spyOn(userResourceService, 'persistUser')
        .mockImplementation(() => Promise.resolve(user));

      await expect(
        authenticatorController.register(registerUserInput),
      ).resolves.toStrictEqual(result);
      expect(jwtIssuerService.issueFor).toHaveBeenCalledWith(user);
      expect(userResourceService.persistUser).toHaveBeenCalledWith(
        registerUserInput,
      );
    });
  });

  describe('#login', () => {
    it('should return access token', async () => {
      const loginUserInput: LoginUserInput = {
        email: 'email@example.com',
        password: 'secret',
      };
      const result = { accessToken: 'jwt' };
      const user = await User.buildFrom(loginUserInput);

      jest
        .spyOn(jwtIssuerService, 'issueFor')
        .mockImplementation(() => Promise.resolve('jwt'));
      jest
        .spyOn(userResourceService, 'findForLoginOrFail')
        .mockImplementation(() => Promise.resolve(user));

      await expect(
        authenticatorController.login(loginUserInput),
      ).resolves.toStrictEqual(result);
      expect(jwtIssuerService.issueFor).toHaveBeenCalledWith(user);
      expect(userResourceService.findForLoginOrFail).toHaveBeenCalledWith(
        loginUserInput,
      );
    });
  });
});
