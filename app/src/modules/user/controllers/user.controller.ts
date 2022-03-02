import { Body, Controller, HttpCode, HttpStatus, Param, Patch, UseFilters } from '@nestjs/common';
import BaseResourceController from '../../../components/controllers/base-resource.controller';
import { UniqueViolationExceptionFilter } from '../../../components/exception-filters/unique-violation-exception.filter';
import UpdatePasswordInput from '../inputs/update-password.input';
import UpdateUserInput from '../inputs/update-user.input';
import UserResourceService from '../services/user-resource.service';

@Controller('/users')
export default class UserController extends BaseResourceController {
  private readonly userResourceService: UserResourceService;

  constructor(userResourceService: UserResourceService) {
    super();
    this.userResourceService = userResourceService;
  }

  @Patch('/:uuid')
  @UseFilters(new UniqueViolationExceptionFilter('Email is already occupied'))
  public async update(@Body() updateUserInput: UpdateUserInput, @Param('uuid') uuid: string) {
    const user = await this.userResourceService.updateUser(updateUserInput, uuid);

    return this.one(user);
  }

  @Patch('/:uuid/password')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async updatePassword(
    @Body() updatePasswordInput: UpdatePasswordInput,
    @Param('uuid') uuid: string,
  ) {
    await this.userResourceService.updateUserPassword(updatePasswordInput, uuid);
  }

  protected getResourceName(): string {
    return 'users';
  }
}
