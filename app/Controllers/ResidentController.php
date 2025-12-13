<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Services\ResidentService;

final class ResidentController {
  public static function store(Request $req): void {
    $createdBy = 1; // MVP
    try {
      $id = ResidentService::createWithUnits($req->json(), $createdBy);
      Response::json(['message' => 'Condômino cadastrado.', 'id' => $id], 201);
    } catch (\Throwable $e) {
      Response::json(['error' => 'BUSINESS_RULE', 'message' => $e->getMessage()], 422);
    }
  }
  
  public static function index(\App\Core\Request $req): void
{
    // se você ainda não tem $req->query(), use $_GET:
    $q = $_GET ?? [];

    $name = trim((string)($q['name'] ?? ''));
    $doc  = trim((string)($q['document'] ?? ''));
    $condoName = trim((string)($q['condominium'] ?? ''));
    $condoId = isset($q['condominium_id']) ? (int)$q['condominium_id'] : null;

    $rows = \App\Models\Resident::list([
        'name' => $name ?: null,
        'document' => $doc ?: null,
        'condominium_name' => $condoName ?: null,
        'condominium_id' => $condoId ?: null,
    ]);

    \App\Core\Response::json(['data' => $rows], 200);
}

}
