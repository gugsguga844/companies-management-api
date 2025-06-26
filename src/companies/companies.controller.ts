import { Controller, Post, Body, Get, Param, ParseIntPipe, Patch, Delete, UseGuards } from '@nestjs/common'; // Adicione Post e Body
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto'; // Importe o DTO
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { LoggedInUser } from 'src/auth/decorators/logged-in-user.decorator';

@Controller('companies')
@UseGuards(AuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {
    console.log('CompaniesController carregado');
  }

  @Post() // Escuta requisições POST para /companies
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @LoggedInUser() firmPayload: { sub: number; email: string }, // Decorator contra o erro de any do lint
  ) {
    const loggedInFirmId = firmPayload.sub;
    return this.companiesService.create(createCompanyDto, loggedInFirmId);
  }

  @Get()
  get() {
    return this.companiesService.get();
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id:number) {
    return this.companiesService.getOne(id);
  }

  @Patch(':id')
  updateData(@Param('id', ParseIntPipe) id:number, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.delete(id);
  }
} 