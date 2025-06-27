/* eslint-disable */
import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { GeneratePaymentsDto } from './dto/generate-payments.dto';
import { ApiOperation } from '@nestjs/swagger';
import { LoggedInUser } from 'src/auth/decorators/logged-in-user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';

@UseGuards(AuthGuard)
@Controller('payments')
export class PaymentsController {
    constructor(private readonly paymentsService: PaymentsService) {}

    @Post('generate')
    @ApiOperation({ summary: 'Gera faturas para todas as empresas' })
    generatePayments
    (
        @LoggedInUser() firmPayload: { sub: number }, // 1. Pegamos o usuário logado
        @Body() generatePaymentsDto: GeneratePaymentsDto
    ) {
        const loggedInFirmId = firmPayload.sub;
        return this.paymentsService.generatePayments(loggedInFirmId, generatePaymentsDto);
    }

    @Get()
    @ApiOperation({ summary: 'Lista todas as faturas' })
    findAll
    (
        @LoggedInUser() firmPayload: { sub: number }
    ) {
        const loggedInFirmId = firmPayload.sub;
        return this.paymentsService.findAll(loggedInFirmId);
    }
}
