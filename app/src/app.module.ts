import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtMiddleware } from './components/middlewares/jwt.middleware';
import { AuthenticatorModule } from './modules/authenticator/authenticator.module';
import UserController from './modules/user/controllers/user.controller';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [MikroOrmModule.forRoot(), UserModule, AuthenticatorModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes(UserController);
  }
}
