<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Models\Condominium;

final class CondominiumController
{
    /**
     * GET /api/condominiums
     * Filtros opcionais: name, cnpj, city
     */
    public static function index(Request $req): void
    {
        $query = $req->query();

        $name = trim((string)($query['name'] ?? ''));
        $cnpj = trim((string)($query['cnpj'] ?? ''));
        $city = trim((string)($query['city'] ?? ''));

        $rows = Condominium::list([
            'name' => $name ?: null,
            'cnpj' => $cnpj ?: null,
            'city' => $city ?: null,
        ]);

        Response::json([
            'data' => $rows
        ], 200);
    }

    /**
     * POST /api/condominiums
     */
    public static function store(Request $req): void
    {
        $b = $req->json();

        $corporate = trim((string)($b['corporate_name'] ?? ''));
        $condoType = $b['condo_type']
            ?? $b['tipoCondominio']
            ?? $b['tipo_condominio']
            ?? null;

        if ($corporate === '') {
            Response::json([
                'error' => 'VALIDATION',
                'message' => 'Razão social é obrigatória.'
            ], 422);
            return;
        }

        if (!$condoType) {
            Response::json([
                'error' => 'VALIDATION',
                'message' => 'Tipo de condomínio é obrigatório.'
            ], 422);
            return;
        }

        $createdBy = 1; // MVP

        $id = Condominium::create([
            'corporate_name' => $corporate,
            'trade_name' => $b['trade_name'] ?? null,
            'email' => $b['email'] ?? null,
            'cnpj' => $b['cnpj'] ?? null,
            'phone' => $b['phone'] ?? null,
            'phone_type' => $b['phone_type'] ?? null,
            'zip_code' => $b['zip_code'] ?? null,
            'street' => $b['street'] ?? null,
            'number' => $b['number'] ?? null,
            'state' => $b['state'] ?? null,
            'city' => $b['city'] ?? null,
            'address_complement' => $b['address_complement'] ?? null,
            'condo_type' => $condoType,
            'created_by' => $createdBy,
        ]);

        Response::json([
            'message' => 'Condomínio cadastrado com sucesso.',
            'id' => $id
        ], 201);
    }
}
