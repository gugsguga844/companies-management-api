import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockPrismaService = {
  accountingFirm: {
    findFirst: jest.fn(),
    create: jest.fn(),
  },
};

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        { provide: JwtService, useValue: {} },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create (register)', () => {
    it('should create a new firm and return it without the password', async () => {
      const registerDto = {
        name: 'Test Firm',
        email: 'test@test.com',
        password: 'password123',
        cnpj: '12345678901234',
      };
      
      const hashedPassword = 'hashed_password';
      mockPrismaService.accountingFirm.findFirst.mockResolvedValue(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      mockPrismaService.accountingFirm.create.mockResolvedValue({
        id: 1,
        ...registerDto,
        password: hashedPassword,
      });
      const result = await service.create(registerDto);

      expect(result).toBeDefined();
      expect(result.email).toEqual(registerDto.email);
      expect(result).not.toHaveProperty('password'); // Garante que a senha foi removida
      expect(prisma.accountingFirm.create).toHaveBeenCalledWith({
        data: {
          ...registerDto,
          password: hashedPassword,
        },
      });
    });

    it('should throw a ConflictException if email or cnpj already exists', async () => {
      const registerDto = {
        name: 'Test Firm',
        email: 'test@test.com',
        password: 'password123',
        cnpj: '12345678901234',
      };
      
      mockPrismaService.accountingFirm.findFirst.mockResolvedValue({ id: 1 });

      await expect(service.create(registerDto)).rejects.toThrow(ConflictException);
    });
  });
});