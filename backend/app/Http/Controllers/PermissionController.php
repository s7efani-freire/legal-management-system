<?php

namespace App\Http\Controllers;

use App\Models\Permission;

class PermissionController extends Controller
{
    public function index()
    {
        return response()->json([
            'ok'   => true,
            'data' => ['permissions' => Permission::all()],
        ]);
    }
}