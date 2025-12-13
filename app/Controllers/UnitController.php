<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Models\ResidentialUnit;

final class UnitController {
  public static function options(Request $req): void {
    $condoId = $req->queryInt('condominium_id', 0);
    if ($condoId <= 0) {
      Response::json(['error' => 'VALIDATION', 'message' => 'condominium_id is required.'], 422);
    }

    Response::json(ResidentialUnit::options($condoId), 200);
  }
}
