import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

// Criamos um "mock" do PrismaService. É um objeto falso que imita o original.
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
    // Aqui criamos um módulo de teste, fornecendo nosso serviço real
    // mas substituindo suas dependências por mocks.
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService, // Usa nosso mock em vez do PrismaService real
        },
        // Também precisamos mockar o JwtService e o ConfigService, embora não os usemos nestes testes
        { provide: JwtService, useValue: {} },
        { provide: ConfigService, useValue: {} },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);

    // Limpa os mocks antes de cada teste para garantir a independência
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create (register)', () => {
    it('should create a new firm and return it without the password', async () => {
      // 1. Arrange (Arranjar o cenário)
      const registerDto = {
        name: 'Test Firm',
        email: 'test@test.com',
        password: 'password123',
        cnpj: '12345678901234',
      };
      
      const hashedPassword = 'hashed_password';
      // Dizemos ao mock do findFirst para retornar null (nenhum usuário encontrado)
      mockPrismaService.accountingFirm.findFirst.mockResolvedValue(null);
      // Dizemos ao mock do bcrypt para retornar um hash específico
      jest.spyOn(bcrypt, 'hash').mockResolvedValue(hashedPassword as never);
      // Dizemos ao mock do create para retornar um usuário criado
      mockPrismaService.accountingFirm.create.mockResolvedValue({
        id: 1,
        ...registerDto,
        password: hashedPassword,
      });

      // 2. Act (Agir - Chamar o método)
      const result = await service.create(registerDto);

      // 3. Assert (Verificar o resultado)
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
      // 1. Arrange
      const registerDto = {
        name: 'Test Firm',
        email: 'test@test.com',
        password: 'password123',
        cnpj: '12345678901234',
      };
      
      // Dizemos ao mock para simular que encontrou um usuário existente
      mockPrismaService.accountingFirm.findFirst.mockResolvedValue({ id: 1 });

      // 2. Act & Assert
      // Verificamos se a chamada ao método rejeita a promessa com o erro esperado
      await expect(service.create(registerDto)).rejects.toThrow(ConflictException);
    });
  });
});