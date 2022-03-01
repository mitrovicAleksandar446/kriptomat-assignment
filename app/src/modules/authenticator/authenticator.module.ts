import { Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import AuthenticatorController from './controllers/authenticator.controller';
import JwtIssuerService from './services/jwt-issuer.service';

@Module({
  imports: [UserModule],
  providers: [JwtIssuerService],
  controllers: [AuthenticatorController],
  exports: [JwtIssuerService],
})
export class AuthenticatorModule {}
