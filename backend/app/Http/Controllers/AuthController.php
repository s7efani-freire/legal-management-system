<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string',
            'last_name'  => 'required|string',
            'cpf'        => 'required|string|unique:users,cpf',
            'email'      => 'required|email|unique:users,email',
            'password'   => 'required|min:8',
            'user_type'  => 'required|in:ADMIN,LAWYER,MANAGER,ACCOUNTING',
        ]);

        $user = User::create([
            'name'       => $request->first_name . ' ' . $request->last_name,
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'cpf'        => $request->cpf,
            'email'      => $request->email,
            'password'   => Hash::make($request->password),
            'user_type'  => $request->user_type,
        ]);

        return response()->json([
            'ok'      => true,
            'message' => 'Usuário cadastrado com sucesso.',
            'data'    => ['user' => $user],
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json([
                'ok'      => false,
                'message' => 'Email ou senha incorretos.',
            ], 401);
        }

        $user  = Auth::user();
        $token = $user->createToken('auth_token')->plainTextToken;

        $user->load('permissions');

        return response()->json([
            'ok'    => true,
            'token' => $token,
            'data'  => [
                'user' => [
                    'id'          => $user->id,
                    'first_name'  => $user->first_name,
                    'last_name'   => $user->last_name,
                    'email'       => $user->email,
                    'user_type'   => $user->user_type,
                    'permissions' => $user->permissionNames(),
                ],
            ],
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        $user->load('permissions');

        return response()->json([
            'ok'   => true,
            'data' => [
                'user' => [
                    'id'                 => $user->id,
                    'first_name'         => $user->first_name,
                    'last_name'          => $user->last_name,
                    'email'              => $user->email,
                    'user_type'          => $user->user_type,
                    'profile_photo_path' => $user->profile_photo_path,
                    'permissions'        => $user->permissionNames(),
                ],
            ],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'ok'      => true,
            'message' => 'Logout realizado com sucesso.',
        ]);
    }
}