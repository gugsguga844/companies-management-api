import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // O OnModuleInit é opcional, mas garante que a conexão
  // com o banco de dados seja estabelecida assim que o módulo for iniciado.
  async onModuleInit() {
    await this.$connect();
  }
}
