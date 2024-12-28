# COR-API

Este é o repositório do projeto COR-API, uma API desenvolvida com Node.js, TypeScript e TypeORM.

## Pré-Requisitos

Antes de iniciar, certifique-se de ter instalado no seu sistema:
- Node.js
- npm ou yarn
- MySQL

## Configuração Inicial

### Instalação do MySQL

1. **Baixe e instale o MySQL**:
   - Acesse [MySQL Downloads](https://dev.mysql.com/downloads/) e escolha a versão adequada para seu sistema operacional.
   - Siga as instruções de instalação, definindo uma senha para o usuário root quando solicitado.

2. **Configurar o MySQL Workbench** (opcional):
   - O MySQL Workbench pode ser utilizado para gerenciar visualmente o banco de dados. É útil para criar esquemas, executar consultas e outras tarefas administrativas.
   - Baixe o MySQL Workbench [aqui](https://dev.mysql.com/downloads/workbench/).

### Configuração do Projeto

1. **Clonar o repositório**:
   ```
   git clone https://github.com/MIMO-tech/CORE.git
   cd CORE
    ```

2. **Instalar dependências**:
    ```
     yarn install
    ```

3. **Configurar variáveis de ambiente**:
- Renomeie o arquivo `.env.example` para `.env`.
- Abra o arquivo `.env` e configure as variáveis de ambiente de acordo com o seu ambiente de desenvolvimento, especificando as credenciais do banco de dados, como:
  ```
  DB_HOST=localhost
  DB_PORT=3306
  DB_USERNAME=root
  DB_PASSWORD=sua_senha
  ```

## Executando Migrações

Antes de iniciar a aplicação, é necessário configurar o banco de dados executando as migrações:

1. **Executar Migrações**:
   ```
   yarn migration:run
   yarn dev
   ```

Isso irá iniciar o servidor usando `nodemon` e `ts-node` para hot reloading.

## Gerando Migrações

1. **Quando realizar mudanças nas entidades ou alterar o esquema do banco de dados, você pode gerar uma nova migração automaticamente com o comando**:
   ```
   yarn migration:generate -n NomeDaNovaMigracao
   ```

  Este comando irá gerar um arquivo de migração na pasta `src/migrations` com as alterações necessárias para aplicar ao banco de dados.
