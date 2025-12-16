# Sistema de Gestão de Condomínios

Este projeto é composto por:
- **Backend** em PHP puro, utilizando o servidor embutido do PHP
- **Frontend** em React (Vite)
- **Banco de dados** MySQL (via XAMPP)

O backend **não utiliza Apache**. Ele é servido através do comando `php -S`, o que permite rodar o projeto fora do `htdocs`.

---

## Requisitos

- PHP 8.1 ou superior (com PDO MySQL habilitado)
- Composer
- Node.js 18+
- MySQL (XAMPP, WAMP ou similar)

---

## Backend (API PHP)

### Instalação
Na raiz do projeto, instale as dependências PHP:

composer install

### Configuração do banco

Inicie o MySQL no XAMPP

Crie o banco de dados conforme o script:

app/Models/SQL.sql

Ajuste as credenciais do banco em:

app/config/database.php

### Subindo a API

O backend é servido pelo servidor embutido do PHP:

php -S localhost:8000 -t public


### Endpoints disponíveis:

GET /api/condominiums

POST /api/condominiums

POST /api/residents

GET /api/units/options

A API ficará disponível em:

http://localhost:8000


Importante: sempre que reiniciar o computador, este comando precisa ser executado novamente.

### Frontend (React)
### Instalação

Entre na pasta do frontend e instale as dependências:

npm install

### Subindo o frontend
npm run dev


O frontend ficará disponível em:

http://localhost:5173

### Fluxo de desenvolvimento

Inicie o MySQL (XAMPP)

Suba a API:

php -S localhost:8000 -t public


Suba o frontend:

npm run dev


Acesse o sistema pelo navegador

Observações importantes

O projeto não precisa estar no htdocs

O Apache do XAMPP não é necessário

Apenas o MySQL é utilizado do XAMPP

A pasta vendor/ é ignorada no Git e deve ser recriada com composer install

### Estrutura resumida
app/
 ├─ Controllers/
 ├─ Core/
 ├─ Models/
 ├─ Services/
 └─ Utils/

public/
 └─ api/
    └─ index.php

src/
 └─ pages/
    ├─ Condominios.tsx
    ├─ Residentes.tsx
    └─ cadastros/
