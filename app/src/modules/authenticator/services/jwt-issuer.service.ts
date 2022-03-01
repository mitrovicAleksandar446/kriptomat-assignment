import { Injectable } from '@nestjs/common';
import { JwtPayload, sign, verify } from 'jsonwebtoken';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export default class JwtIssuerService {
  public issueFor(payload: Record<string, any>): Promise<string> {
    return new Promise((resolve, reject) => {
      const jwtPayload = instanceToPlain(payload),
        jwtSecret = process.env.JWT_SECRET,
        options = { expiresIn: parseInt(process.env.JWT_TTL) };

      sign(jwtPayload, jwtSecret, options, (err, token) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(token);
      });
    });
  }

  public verify(jwt: string): Promise<string | JwtPayload> {
    return new Promise((resolve, reject) => {
      const jwtSecret = process.env.JWT_SECRET,
        options = { ignoreExpiration: false };
      verify(jwt, jwtSecret, options, (err, decode) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(decode);
      });
    });
  }
}
