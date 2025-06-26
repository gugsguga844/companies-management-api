import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterAccountingFirmDto } from 'src/auth/dto/register-accounting-firm.dto';
import { LoginAccountingFirmDto } from 'src/auth/dto/login-accounting-firm.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService) {
        console.log('AuthController carregado');
    }

    @Post('register')
    @ApiOperation({ summary: 'Cria uma nova empresa ligada ao escritório logado' })
    create(@Body() registerAccountFirmDto: RegisterAccountingFirmDto) {
        return this.authService.create(registerAccountFirmDto);
    }

    @Post('login')
    @ApiOperation({ summary: 'Realiza login de uma empresa' })
    login(@Body() loginDto: LoginAccountingFirmDto) {
        return this.authService.login(loginDto);
    }
}
