/* eslint-disable */
import { Controller, Post, Body, UseGuards, Get, Query, Patch, Param } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { UpdatePaymentDto } from './dto/update-payment.dto';
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
        @LoggedInUser() firmPayload: { sub: number },
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

    @Get('monthly-revenue')
    @ApiOperation({ summary: 'Receita mensal (dashboard)' })
    getMonthlyRevenue(
      @LoggedInUser() firmPayload: { sub: number },
      @Query('year') year?: string,
      @Query('month') month?: string,
    ) {
      const loggedInFirmId = firmPayload.sub;
      return this.paymentsService.getMonthlyRevenue(
        loggedInFirmId,
        year ? parseInt(year) : undefined,
        month ? parseInt(month) : undefined,
      );
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Atualiza status/data de pagamento da fatura' })
    updatePayment(
      @Param('id') id: string,
      @Body() updatePaymentDto: UpdatePaymentDto,
    ) {
      return this.paymentsService.updatePayment(Number(id), updatePaymentDto);
    }
}
