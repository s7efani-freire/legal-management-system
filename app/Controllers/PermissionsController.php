<?php
declare(strict_types=1);

namespace App\Controllers;

use App\Core\Request;
use App\Core\Response;
use App\Models\PermissionModel;

final class PermissionsController
{
    private PermissionModel $permissions;

    public function __construct()
    {
        $this->permissions = new PermissionModel();
    }

    // GET /api/permissions
    public function index(Request $req, Response $res): void
    {
        $rows = $this->permissions->all();
        $res->json(['ok' => true, 'data' => ['permissions' => $rows]]);
    }
}
