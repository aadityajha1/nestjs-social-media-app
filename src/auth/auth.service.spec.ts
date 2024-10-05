import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import * as bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it("should throw BadRequestException when the password does not match the user's password", async () => {
    const loginDto = { email: 'test@example.com', password: 'wrongPassword' };
    const user = {
      email: 'test@example.com',
      password: 'hashedPassword',
      _id: 'userId',
    };

    jest
      .spyOn(service['userService'], 'findOneByEmailOrUsername')
      .mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    await expect(service.login(loginDto)).rejects.toThrow(BadRequestException);
  });

  it('should return an access token when the email and password are correct', async () => {
    const loginDto = { email: 'test@example.com', password: 'correctPassword' };
    const user = {
      email: 'test@example.com',
      password: 'hashedPassword',
      _id: 'userId',
    };
    const accessToken = 'mockAccessToken';

    jest
      .spyOn(service['userService'], 'findOneByEmailOrUsername')
      .mockResolvedValue(user);
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
    jest.spyOn(service['jwtService'], 'sign').mockReturnValue(accessToken);

    const result = await service.login(loginDto);

    expect(result).toEqual({ access_token: accessToken });
  });
});
