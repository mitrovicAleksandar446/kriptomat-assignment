import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware, UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import JwtIssuerService from '../../modules/authenticator/services/jwt-issuer.service';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtIssuer: JwtIssuerService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const authorizationHeader = req.headers['authorization'];

    if (!authorizationHeader) {
      throw new UnauthorizedException('Unauthorized');
    }

    const jwt = authorizationHeader.split(' ')[1];

    if (!jwt) {
      throw new UnauthorizedException('Unauthorized');
    }

    try {
      await this.jwtIssuer.verify(jwt);
    } catch (err) {
      throw new UnauthorizedException('Unauthorized');
    }

    next();
  }
}
