import { execSync } from 'child_process';
import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

export default async () => {
  // Constrói o caminho absoluto para o nosso .env.test
  const envPath = path.resolve(__dirname, '../.env.test');

  // Verifica se o arquivo existe antes de tentar lê-lo
  if (!fs.existsSync(envPath)) {
    throw new Error('Arquivo .env.test não encontrado!');
  }

  // Lê o conteúdo do arquivo
  const envFileContent = fs.readFileSync(envPath);
  
  // Usa o dotenv para "parsear" (analisar) o conteúdo em um objeto { CHAVE: VALOR }
  const envConfig = dotenv.parse(envFileContent);

  console.log('\n\nSetting up test database...');

  // Executa o comando de migração, passando as variáveis de ambiente explicitamente
  execSync('npx prisma migrate deploy', {
    // O truque está aqui: passamos as variáveis para o processo filho,
    // garantindo que elas sobrescrevam qualquer outra coisa.
    env: {
      ...process.env, // Herda o ambiente atual do sistema
      ...envConfig,    // E sobrescreve com as nossas variáveis do .env.test
    },
    stdio: 'inherit', // Mostra a saída do comando no nosso console
  });

  console.log('Test database setup complete.');
};