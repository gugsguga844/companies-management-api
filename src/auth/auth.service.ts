import { Injectable, ConflictException, UnauthorizedException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { RegisterAccountingFirmDto } from 'src/auth/dto/register-accounting-firm.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AccountingFirm } from '@prisma/client';
import { LoginAccountingFirmDto } from 'src/auth/dto/login-accounting-firm.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private readonly prisma: PrismaService, private jwtService: JwtService) {
        console.log('AuthService carregado');
    }

    async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltOrRounds);
        return hashedPassword;
    }

    async comparePassword(password: string, storedHash: string): Promise<boolean> {
        const isMatch = await bcrypt.compare(password, storedHash);

        return isMatch;
    }

    async create(registerDto: RegisterAccountingFirmDto): Promise<Omit<AccountingFirm, 'password'>>{
        const existingFirm = await this.prisma.accountingFirm.findFirst({
            where: {
                OR: [
                    {
                        email: registerDto.email
                    },
                    {
                        cnpj: registerDto.cnpj
                    }
                ]
            }
        })

        if (existingFirm) {
            throw new ConflictException('Email ou CNPJ já cadastrado.');
        }

        const hashedPassword = await this.hashPassword(registerDto.password);
        const createdFirm = await this.prisma.accountingFirm.create({
            data: {
                ...registerDto,
                password: hashedPassword
            },
        })

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = createdFirm;
        return result;
    }

    async login(loginDto: LoginAccountingFirmDto) {
        const firm = await this.prisma.accountingFirm.findUnique({
            where: {
                email: loginDto.email
            }
        })

        if (!firm) {
            throw new NotFoundException('Email ou senha inválidos');
        }

        const match = await this.comparePassword(loginDto.password, firm.password)

        if (!match) {
            throw new UnauthorizedException('Email ou senha inválidos');
        }

        const payload = { sub: firm.id, email: firm.email }
        return {
            access_token: await this.jwtService.signAsync(payload)
        }
    }
}
