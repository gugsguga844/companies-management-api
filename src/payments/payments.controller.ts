/* eslint-disable */
import { Controller, Post, Body } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { GeneratePaymentsDto } from './dto/generate-payments.dto';
import { ApiOperation } from '@nestjs/swagger';
import { LoggedInUser } from 'src/auth/decorators/logged-in-user.decorator';

@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post('generate')
    @ApiOperation({ summary: 'Gera faturas para todas as empresas' })
    generatePayments
    (
        @LoggedInUser() firmPayload: { sub: number; email: string }, // 1. Pegamos o usuário logado
        @Body() generatePaymentsDto: GeneratePaymentsDto
    ) {
        const loggedInFirmId = firmPayload.sub;
        return this.paymentsService.generatePayments(loggedInFirmId, generatePaymentsDto);
    }
}
