import JwtIssuerService from './jwt-issuer.service';

describe('JwtIssuerService', () => {
  const jwtIssuerService: JwtIssuerService = new JwtIssuerService();

  describe('# issueFor', () => {
    describe('When payload is empty', () => {
      it('should throw an exception"', async () => {
        await expect(jwtIssuerService.issueFor(null)).rejects.toThrow(Error);
      });
    });

    describe('When payload is provided', () => {
      it('should generate a jwt token"', async () => {
        const token = await jwtIssuerService.issueFor({ test: true });
        expect(typeof token).toBe('string');
        await expect(jwtIssuerService.verify(token)).resolves.toHaveProperty('test');
      });
    });
  });

  describe('# verify', () => {
    describe('When token is not jwt', () => {
      it('should throw an exception"', async () => {
        await expect(jwtIssuerService.verify('jwt')).rejects.toThrow(Error);
      });
    });
  });
});
