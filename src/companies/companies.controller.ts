import { Controller, Post, Body, Get, Param, ParseIntPipe, Patch, Delete, UseGuards } from '@nestjs/common'; // Adicione Post e Body
import { CompaniesService } from './companies.service';
import { CreateCompanyDto } from './dto/create-company.dto'; // Importe o DTO
import { UpdateCompanyDto } from './dto/update-company.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { LoggedInUser } from 'src/auth/decorators/logged-in-user.decorator';
import { ApiOperation, ApiResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('companies')
@ApiBearerAuth()
@Controller('companies')
@UseGuards(AuthGuard)
export class CompaniesController {
  constructor(private readonly companiesService: CompaniesService) {
    console.log('CompaniesController carregado');
  }

  @ApiResponse({ status: 201, description: 'A empresa foi criada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado. Token inválido ou expirado.' })
  @Post() // Escuta requisições POST para /companies
  @ApiOperation({ summary: 'Cria uma nova empresa ligada ao escritório logado' })
  create(
    @Body() createCompanyDto: CreateCompanyDto,
    @LoggedInUser() firmPayload: { sub: number; email: string }, // Decorator contra o erro de any do lint
  ) {
    const loggedInFirmId = firmPayload.sub;
    return this.companiesService.create(createCompanyDto, loggedInFirmId);
  }

  @ApiResponse({ status: 200, description: 'Lista de empresas retornada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado. Token inválido ou expirado.' })
  @ApiOperation({ summary: 'Retorna todas as empresas cadastradas' })
  @Get()
  get() {
    return this.companiesService.get();
  }

  @ApiResponse({ status: 200, description: 'Empresa retornada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado. Token inválido ou expirado.' })
  @ApiOperation({ summary: 'Retorna uma empresa específica pelo ID' })
  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id:number) {
    return this.companiesService.getOne(id);
  }

  @ApiResponse({ status: 200, description: 'Empresa atualizada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado. Token inválido ou expirado.' })
  @ApiOperation({ summary: 'Atualiza os dados de uma empresa específica pelo ID' })
  @Patch(':id')
  updateData(@Param('id', ParseIntPipe) id:number, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companiesService.update(id, updateCompanyDto);
  }

  @ApiResponse({ status: 200, description: 'Empresa deletada com sucesso.' })
  @ApiResponse({ status: 401, description: 'Não autorizado. Token inválido ou expirado.' })
  @ApiOperation({ summary: 'Remove uma empresa específica pelo ID' })
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.companiesService.delete(id);
  }
} 