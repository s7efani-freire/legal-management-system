<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;

class ProfileController extends Controller
{
    public function me(Request $request)
    {
        $user = $request->user();

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
                ],
            ],
        ]);
    }

    public function update(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'first_name' => 'required|string',
            'last_name'  => 'required|string',
            'email'      => 'required|email|unique:users,email,' . $user->id,
        ]);

        $user->update([
            'first_name' => $request->first_name,
            'last_name'  => $request->last_name,
            'name'       => $request->first_name . ' ' . $request->last_name,
            'email'      => $request->email,
        ]);

        return response()->json([
            'ok'      => true,
            'message' => 'Dados atualizados com sucesso.',
            'data'    => ['user' => $user],
        ]);
    }

    public function updatePassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'new_password'     => 'required|min:8',
        ]);

        $user = $request->user();

        if (!Hash::check($request->current_password, $user->password)) {
            return response()->json([
                'ok'      => false,
                'message' => 'Senha atual incorreta.',
            ], 422);
        }

        $user->update(['password' => Hash::make($request->new_password)]);

        return response()->json([
            'ok'      => true,
            'message' => 'Senha alterada com sucesso.',
        ]);
    }

    public function uploadPhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|max:5120',
        ]);

        $user = $request->user();

        if ($user->profile_photo_path) {
            Storage::disk('public')->delete($user->profile_photo_path);
        }

        $path = $request->file('photo')->store('profile-photos', 'public');
        $user->update(['profile_photo_path' => '/storage/' . $path]);

        return response()->json([
            'ok'      => true,
            'message' => 'Foto atualizada com sucesso.',
            'data'    => ['user' => $user],
        ]);
    }
}