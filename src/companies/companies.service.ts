/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; // Importe o PrismaService
import { CreateCompanyDto } from './dto/create-company.dto'; // Importe nosso DTO

@Injectable()
export class CompaniesService {
  // 1. Injetamos o PrismaService no construtor
  constructor(private readonly prisma: PrismaService) {}

  // 2. Criamos o método 'create'
  // Ele recebe os dados validados (graças ao DTO) do controller
  async create(createCompanyDto: CreateCompanyDto) {
    // 3. Usamos o Prisma para criar uma nova empresa no banco
    // NOTA: Por enquanto, vamos "chumbar" o accounting_firm_id com o valor 1.
    // Na Sprint de Autenticação, vamos substituir isso pelo ID do usuário logado.
    return this.prisma.company.create({
      data: {
        ...createCompanyDto,
        accounting_firm_id: 1, // << VALOR PROVISÓRIO
      },
    });
  }

  async get() {
    return this.prisma.company.findMany();
  }

  async getOne(id: number) {
    if (!id) {
      throw new BadRequestException('ID inválido');
    }
    return this.prisma.company.findUnique({
      where: {
        id,
      },
    });
  }
}