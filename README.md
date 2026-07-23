# Sistema de Gestão de Condomínios

Este projeto é composto por:

- **Frontend** em React (Vite) — código-fonte em `src/`
- **Backend** em Laravel, com autenticação via Sanctum — código-fonte em `backend/`

---

## Requisitos

- Node.js 18+
- PHP 8.2+ e Composer (apenas para rodar o backend)

---

## Frontend (React)

### Instalação

```bash
npm install
```

### Subindo o frontend

```bash
npm run dev
```

O frontend ficará disponível em `http://localhost:5173`.

> As telas atualmente consomem dados mockados diretamente nos componentes — não é necessário subir o backend para navegar pela aplicação.

### Build de produção

```bash
npm run build
```

---

## Backend (Laravel)

Instruções detalhadas, incluindo configuração de banco de dados, em [`backend/README.md`](backend/README.md).

### Instalação rápida

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

A API ficará disponível em `http://localhost:8000`.

---

## Estrutura resumida

```
src/            # frontend (React + Vite)
backend/        # backend (Laravel + Sanctum)
```
