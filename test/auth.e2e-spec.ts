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
});