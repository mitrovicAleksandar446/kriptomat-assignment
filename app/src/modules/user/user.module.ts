import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import UserController from './controllers/user.controller';
import { User } from './entities/user.entity';
import UserResourceService from './services/user-resource.service';

@Module({
  controllers: [UserController],
  exports: [UserResourceService],
  imports: [MikroOrmModule.forFeature({ entities: [User] })],
  providers: [UserResourceService],
})
export class UserModule {}
