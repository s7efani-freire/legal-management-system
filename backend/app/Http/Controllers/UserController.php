<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Permission;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('permissions')->where('active', true)->get();

        $groups = $users->groupBy('user_type')->map(function ($group) {
            return $group->map(fn($u) => [
                'id'               => $u->id,
                'nome'             => trim($u->first_name . ' ' . $u->last_name),
                'email'            => $u->email,
                'role'             => $u->user_type,
                'user_type'        => $u->user_type,
                'cadastradoEm'     => $u->created_at?->format('d/m/Y'),
                'ultimaAtualizacao' => $u->updated_at?->format('d/m/Y'),
                'permissions'      => $u->permissionNames(),
            ]);
        });

        return response()->json(['ok' => true, 'groups' => $groups]);
    }

    public function deactivate(Request $request)
    {
        $request->validate(['id' => 'required|exists:users,id']);

        $user = User::findOrFail($request->id);

        if ($user->user_type === 'ADMIN') {
            return response()->json(['ok' => false, 'message' => 'Não é permitido desativar um ADMIN.'], 403);
        }

        $user->update(['active' => false]);

        return response()->json(['ok' => true, 'message' => 'Usuário desativado com sucesso.']);
    }

    public function setPermissions(Request $request)
    {
        $request->validate([
            'id'            => 'required|exists:users,id',
            'permissions'   => 'array',
            'permissions.*' => 'string|exists:permissions,name',
        ]);

        $user        = User::findOrFail($request->id);
        $permIds     = Permission::whereIn('name', $request->permissions ?? [])->pluck('id');
        $user->permissions()->sync($permIds);

        return response()->json(['ok' => true, 'message' => 'Permissões atualizadas.']);
    }
}