import { Controller, Post, Body, Get, Param, ParseIntPipe, Patch } from '@nestjs/common'; // Adicione Post e Body
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto'; // Importe o DTO
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('companies')
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {
    console.log('CompaniesController carregado');
  }

  @Post() // Escuta requisições POST para /companies
  create(@Body() createCompanyDto: CreateCompanyDto) {
    // 1. O decorador @Body() extrai o corpo da requisição.
    // 2. O NestJS, junto com o ValidationPipe que configuraremos, valida
    //    automaticamente o corpo contra o CreateCompanyDto.
    // 3. Se for válido, chama o serviço. Se não, retorna um erro 400.
    return this.companiesService.create(createCompanyDto);
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
} 