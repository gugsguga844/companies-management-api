import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { TransformInterceptor } from '../src/common/interceptors/transform.interceptor'; // 1. Importe o interceptor

describe('AuthController (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  jest.setTimeout(15000); // <-- AUMENTA O TIMEOUT PARA 15 SEGUNDOS

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

    app.useGlobalInterceptors(new TransformInterceptor());
    
    await app.init();

    prisma = app.get<PrismaService>(PrismaService);
    await prisma.payment.deleteMany();
    await prisma.company.deleteMany();
    await prisma.accountingFirm.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/auth/register (POST)', () => {
    it('should register a second accounting firm successfully', async () => {
      const dto = {
        name: 'Contabilidade Teste 2',
        email: 'contaaaaa2@teste.com',
        password: '12345678',
        cnpj: '22222222222222',
        phone: '+5511999990000',
        fantasy_name: 'Contab Teste 2'
      };
      const response = await request(app.getHttpServer())
        .post('/v1/auth/register')
        .send(dto);
      console.log('SEGUNDA ACCOUNTING FIRM RESPONSE:', response.body);
      expect(response.status).toBe(201);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data.email).toBe(dto.email);
      // Confirma que agora existem 1 ou mais accounting_firm
      const allFirms = await prisma.accountingFirm.findMany();
      expect(allFirms.length).toBeGreaterThanOrEqual(1);
    });
    it('should register a new accounting firm successfully', () => {
      const dto = {
        name: 'Test Firm E2E',
        email: 'test.e2e@firm.com',
        password: 'strongpassword123',
        cnpj: '00.111.222/0001-33',
      };

      return request(app.getHttpServer())
        .post('/v1/auth/register')
        .send(dto)
        .expect(201)
        .then((response) => {
          expect(response.body.data).toBeDefined();
          expect(response.body.data.email).toEqual(dto.email);
          expect(response.body.data).not.toHaveProperty('password');
        });
    });

    it('should fail if email is already in use', async () => {
      const dto = {
        name: 'Another Test Firm',
        email: 'test.e2e@firm.com',
        password: 'password123',
        cnpj: '11.222.333/0001-44',
      };

      return request(app.getHttpServer())
        .post('/v1/auth/register')
        .send(dto)
        .expect(409);
    });
  });

  describe('/auth/login (POST)', () => {
    it('should authenticate user and return an access token', () => {
      const loginDto = {
        email: 'test.e2e@firm.com', // Email do usuário criado no primeiro teste
        password: 'strongpassword123', // Senha correta
      };

      return request(app.getHttpServer())
        .post('/v1/auth/login')
        .send(loginDto)
        .expect(200) // Espera um status 200 OK
        .then((response) => {
          // Verifica se a resposta tem o formato { data: { access_token: '...' } }
          expect(response.body.data).toBeDefined();
          expect(response.body.data.access_token).toEqual(expect.any(String));
        });
    });

    it('should fail with wrong password', () => {
      const loginDto = {
        email: 'test.e2e@firm.com', // Email correto
        password: 'wrong-password', // Senha incorreta
      };

      return request(app.getHttpServer())
        .post('/v1/auth/login')
        .send(loginDto)
        .expect(401); // Espera um status 401 Unauthorized
    });

    it('should fail with non-existent email', () => {
      const loginDto = {
        email: 'non-existent@email.com', // Email que não existe
        password: 'some-password',
      };

      return request(app.getHttpServer())
        .post('/v1/auth/login')
        .send(loginDto)
        .expect(404); // Espera um status 404 Not Found
    });
  });
});