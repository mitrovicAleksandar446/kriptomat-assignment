import { UniqueConstraintViolationException } from '@mikro-orm/core';
import { HttpException, HttpStatus } from '@nestjs/common';
import LoginUserInput from '../../authenticator/inputs/login-user.input';
import RegisterUserInput from '../../authenticator/inputs/register-user.input';
import { User } from '../entities/user.entity';
import UpdatePasswordInput from '../inputs/update-password.input';
import UpdateUserInput from '../inputs/update-user.input';
import UserResourceService from './user-resource.service';
import UserRepository from '../repositories/user.repository';

describe('UserResourceService', () => {
  let userResourceService: UserResourceService;
  let userRepository: UserRepository;

  function mockUserService(stubs: any) {
    userRepository = jest.fn().mockImplementation(() => stubs)();
    userResourceService = new UserResourceService(userRepository);
  }

  describe('#persistUser', () => {
    it('successfully persist user', async () => {
      mockUserService({
        persistAndFlush: jest.fn(),
      });

      const registerUserInput: RegisterUserInput = {
        name: 'test name',
        email: 'test@gmail.com',
        password: 'test password',
        address: 'test address',
        phone: 'test phone',
      };

      const user = await userResourceService.persistUser(registerUserInput);

      expect(userRepository.persistAndFlush).toHaveBeenCalled();
      expect(user.getName()).toBe('test name');
      expect(user.getEmail()).toBe('test@gmail.com');
      expect(user.getPassword()).toContain('$2b$');
      expect(user.getAddress()).toBe('test address');
      expect(user.getPhone()).toBe('test phone');
    });

    describe('When repository is throwing an unique constraint exception', () => {
      it('should re-throw it from the service', async () => {
        mockUserService({
          persistAndFlush: jest.fn(() => {
            throw new UniqueConstraintViolationException(new Error());
          }),
        });

        const registerUserInput: RegisterUserInput = {
          name: 'test name',
          email: 'test@gmail.com',
          password: 'test password',
        };

        await expect(
          userResourceService.persistUser(registerUserInput),
        ).rejects.toThrowError(UniqueConstraintViolationException);
      });
    });
  });

  describe('#findForLoginOrFail', () => {
    it('returns user when credentials are good', async () => {
      const user: User = await User.buildFrom({
        uuid: 'test-123',
        name: 'test name',
        email: 'test@gmail.com',
        password: 'test',
      });

      mockUserService({
        findOne: jest.fn(() => user),
      });

      const loginUserInput: LoginUserInput = {
        email: 'test@gmail.com',
        password: 'test',
      };

      const userFromService = await userResourceService.findForLoginOrFail(
        loginUserInput,
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({
        email: user.getEmail(),
      });
      expect(userFromService.getUuid()).toBe(user.getUuid());
      expect(userFromService.getName()).toBe(user.getName());
      expect(userFromService.getEmail()).toBe(user.getEmail());
    });

    describe('When user is not found', () => {
      it('should throw a HttpException', async () => {
        mockUserService({
          findOne: jest.fn(() => null),
        });
        const loginUserInput: LoginUserInput = {
          email: 'test@gmail.com',
          password: 'test',
        };

        await expect(
          userResourceService.findForLoginOrFail(loginUserInput),
        ).rejects.toThrowError(HttpException);
      });
    });

    describe("When user's password is not matched", () => {
      it('should throw a HttpException', async () => {
        const user: User = await User.buildFrom({
          uuid: 'test-123',
          name: 'test name',
          email: 'test@gmail.com',
          password: 'test',
        });

        mockUserService({
          findOne: jest.fn(() => user),
        });

        const loginUserInput: LoginUserInput = {
          email: 'test@gmail.com',
          password: 'test-wrong',
        };

        await expect(
          userResourceService.findForLoginOrFail(loginUserInput),
        ).rejects.toThrowError(HttpException);
      });
    });
  });

  describe('#updateUser', () => {
    it('should partially update a user with the correct input', async () => {
      const user: User = await User.buildFrom({
        uuid: 'test-123',
        name: 'test name',
        email: 'test@gmail.com',
      });

      const updateUserInput: UpdateUserInput = {
        name: 'changed name',
      };

      mockUserService({
        findOne: jest.fn(() => user),
        persistAndFlush: jest.fn(),
      });

      const updatedUser = await userResourceService.updateUser(
        updateUserInput,
        user.getUuid(),
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        uuid: user.getUuid(),
      });
      expect(userRepository.persistAndFlush).toHaveBeenCalled();
      expect(updatedUser.getName()).toBe(updateUserInput.name);
      expect(updatedUser.getEmail()).toBe(user.getEmail());
      expect(updatedUser.getUuid()).toBe(user.getUuid());
    });

    describe('When user is not found', () => {
      it('should throw HttpException', async () => {
        mockUserService({
          findOne: jest.fn(() => null),
          persistAndFlush: jest.fn(),
        });

        const updateUserInput: UpdateUserInput = {};

        expect(userRepository.persistAndFlush).toHaveBeenCalledTimes(0);
        await expect(
          userResourceService.updateUser(updateUserInput, 'uuid'),
        ).rejects.toThrowError('User not found');
      });
    });
  });

  describe('#updateUserPassword', () => {
    it("reset user's password when input is correct", async () => {
      const user: User = await User.buildFrom({
        uuid: 'test-123',
        name: 'test name',
        email: 'test@gmail.com',
        password: 'test',
      });

      mockUserService({
        findOne: jest.fn(() => user),
        persistAndFlush: jest.fn(),
      });

      const updatePasswordInput: UpdatePasswordInput = {
        newPassword: 'test-new',
        oldPassword: 'test',
      };

      await userResourceService.updateUserPassword(
        updatePasswordInput,
        user.getUuid(),
      );

      expect(userRepository.findOne).toHaveBeenCalledWith({
        uuid: user.getUuid(),
      });
      expect(userRepository.persistAndFlush).toHaveBeenCalled();
      await expect(
        user.verifyPassword(updatePasswordInput.newPassword),
      ).resolves.toBe(true);
    });

    describe('When user is not found', () => {
      it('should throw a HttpException', async () => {
        mockUserService({
          findOne: jest.fn(() => null),
          persistAndFlush: jest.fn(),
        });

        const updatePasswordInput: UpdatePasswordInput = {
          newPassword: 'new',
          oldPassword: 'old',
        };

        await expect(
          userResourceService.updateUserPassword(updatePasswordInput, 'uuid'),
        ).rejects.toThrowError(HttpException);
        expect(userRepository.persistAndFlush).toHaveBeenCalledTimes(0);
      });
    });

    describe('When old password is not correct', () => {
      it('should not change the password and throw an exception', async () => {
        const OLD_PASSWORD = 'current';
        const user: User = await User.buildFrom({
          uuid: 'test-123',
          name: 'test name',
          email: 'test@gmail.com',
          password: OLD_PASSWORD,
        });

        mockUserService({
          findOne: jest.fn(() => user),
          persistAndFlush: jest.fn(),
        });

        const updatePasswordInput: UpdatePasswordInput = {
          newPassword: 'new',
          oldPassword: 'current wrong',
        };

        await expect(
          userResourceService.updateUserPassword(
            updatePasswordInput,
            user.getUuid(),
          ),
        ).rejects.toThrowError('Incorrect password');
        expect(userRepository.persistAndFlush).toHaveBeenCalledTimes(0);
        await expect(user.verifyPassword(OLD_PASSWORD)).resolves.toBe(true);
      });
    });
  });
});
