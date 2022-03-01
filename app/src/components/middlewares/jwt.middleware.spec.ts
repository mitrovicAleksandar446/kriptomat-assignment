import { UnauthorizedException } from '@nestjs/common';
import JwtIssuerService from '../../modules/authenticator/services/jwt-issuer.service';
import { JwtMiddleware } from './jwt.middleware';

describe('JwtMiddleware', () => {
  let jwtMiddleware: JwtMiddleware;
  let jwtIssuer: JwtIssuerService;

  function mockJwtMiddleware(stubs: any) {
    jwtIssuer = jest.fn().mockImplementation(() => stubs)();
    jwtMiddleware = new JwtMiddleware(jwtIssuer);
  }

  describe('#use', () => {
    describe('When authorization header is not present', () => {
      it('should throw an Unauthorized exception', async () => {
        mockJwtMiddleware({});

        const req = jest.fn().mockImplementation(() => ({
          headers: {},
        }))();
        const res = jest.fn().mockImplementation(() => ({}))();

        await expect(
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          jwtMiddleware.use(req, res, () => {}),
        ).rejects.toThrowError(UnauthorizedException);
      });
    });

    describe('When authorization header is not in form: Bearer {token}', () => {
      it('should throw an Unauthorized exception', async () => {
        mockJwtMiddleware({});

        const req = jest.fn().mockImplementation(() => ({
          headers: { authorization: 'invalid' },
        }))();
        const res = jest.fn().mockImplementation(() => ({}))();

        await expect(
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          jwtMiddleware.use(req, res, () => {}),
        ).rejects.toThrowError(UnauthorizedException);
      });
    });

    describe('When token is not in JWT format/expired/or wrongly signed', () => {
      it('should throw an Unauthorized exception', async () => {
        mockJwtMiddleware({
          verify: jest.fn(() => {
            throw new Error('invalid');
          }),
        });

        const req = jest.fn().mockImplementation(() => ({
          headers: { authorization: 'invalid' },
        }))();
        const res = jest.fn().mockImplementation(() => ({}))();
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const next = jest.fn(() => {});

        await expect(jwtMiddleware.use(req, res, next)).rejects.toThrowError(
          UnauthorizedException,
        );
        expect(next).toHaveBeenCalledTimes(0);
      });
    });

    describe('When token is in valid form and verified', () => {
      it('should call the next() function and forward the request', async () => {
        mockJwtMiddleware({
          verify: jest.fn(),
        });

        const req = jest.fn().mockImplementation(() => ({
          headers: { authorization: 'Bearer validToken' },
        }))();
        const res = jest.fn().mockImplementation(() => ({}))();
        const next = jest.fn();

        await jwtMiddleware.use(req, res, next);

        expect(jwtIssuer.verify).toHaveBeenCalled();
        expect(next).toHaveBeenCalled();
      });
    });
  });
});
