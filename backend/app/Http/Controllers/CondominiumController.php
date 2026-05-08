<?php

namespace App\Http\Controllers;

use App\Models\Condominium;
use Illuminate\Http\Request;

class CondominiumController extends Controller
{
    public function index(Request $request)
    {
        $query = Condominium::query();

        if ($request->filled('name')) {
            $query->where(function ($q) use ($request) {
                $q->where('corporate_name', 'like', '%' . $request->name . '%')
                  ->orWhere('trade_name', 'like', '%' . $request->name . '%');
            });
        }

        if ($request->filled('cnpj')) {
            $query->where('cnpj', 'like', '%' . $request->cnpj . '%');
        }

        if ($request->filled('city')) {
            $query->where('city', 'like', '%' . $request->city . '%');
        }

        return response()->json([
            'ok'   => true,
            'data' => $query->orderBy('corporate_name')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'corporate_name' => 'required|string',
        ]);

        $condominium = Condominium::create($request->all());

        return response()->json([
            'ok'      => true,
            'message' => 'Condomínio cadastrado com sucesso.',
            'data'    => $condominium,
        ], 201);
    }

    public function destroy($id)
    {
        Condominium::findOrFail($id)->delete();

        return response()->json([
            'ok'      => true,
            'message' => 'Condomínio removido com sucesso.',
        ]);
    }
}