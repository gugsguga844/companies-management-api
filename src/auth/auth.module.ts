import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      // Usamos useFactory para configurar o módulo de forma dinâmica
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get<string>('JWT_SECRET'), // Lê o segredo do .env
          signOptions: { expiresIn: '1d' }, // O token expira em 1 dia
        };
      },
      inject: [ConfigService], // Injeta o ConfigService para ser usado na factory
      global: true, // Torna o JwtModule disponível globalmente
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService]
})
export class AuthModule {}
