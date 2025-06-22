import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Deixa o módulo global
@Module({
  providers: [PrismaService],
  exports: [PrismaService], // Permite que outros módulos usem o PrismaService
})
export class PrismaModule {}