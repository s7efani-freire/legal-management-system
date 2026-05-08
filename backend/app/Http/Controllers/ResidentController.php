<?php

namespace App\Http\Controllers;

use App\Models\Resident;
use Illuminate\Http\Request;

class ResidentController extends Controller
{
    public function index(Request $request)
    {
        $query = Resident::with(['dwellings.condominium']);

        if ($request->filled('name')) {
            $query->where(function ($q) use ($request) {
                $q->where('first_name', 'like', '%' . $request->name . '%')
                  ->orWhere('last_name', 'like', '%' . $request->name . '%');
            });
        }

        if ($request->filled('document')) {
            $query->where('document_number', 'like', '%' . $request->document . '%');
        }

        if ($request->filled('condominium')) {
            $query->whereHas('dwellings.condominium', function ($q) use ($request) {
                $q->where('corporate_name', 'like', '%' . $request->condominium . '%')
                  ->orWhere('trade_name', 'like', '%' . $request->condominium . '%');
            });
        }

        $residents = $query->orderBy('first_name')->get()->map(function ($r) {
            return [
                'id'              => $r->id,
                'first_name'      => $r->first_name,
                'last_name'       => $r->last_name,
                'document_number' => $r->document_number,
                'email'           => $r->email,
                'phone'           => $r->phone,
                'phone_type'      => $r->phone_type,
                'dwellings'       => $r->dwellings->map(fn($d) => [
                    'unit_number'    => $d->unit_number,
                    'building_block' => $d->building_block,
                    'condominium'    => $d->condominium?->trade_name ?? $d->condominium?->corporate_name ?? '-',
                ]),
            ];
        });

        return response()->json(['ok' => true, 'data' => $residents]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'first_name' => 'required|string',
            'last_name'  => 'required|string',
        ]);

        $resident = Resident::create($request->only([
            'first_name', 'last_name', 'document_number', 'email', 'phone', 'phone_type',
        ]));

        if ($request->filled('condominium_id') && $request->filled('unit_number')) {
            $resident->dwellings()->create([
                'condominium_id' => $request->condominium_id,
                'unit_number'    => $request->unit_number,
                'building_block' => $request->building_block,
            ]);
        }

        return response()->json([
            'ok'      => true,
            'message' => 'Condômino cadastrado com sucesso.',
            'data'    => $resident,
        ], 201);
    }

    public function destroy($id)
    {
        Resident::findOrFail($id)->delete();

        return response()->json([
            'ok'      => true,
            'message' => 'Condômino removido com sucesso.',
        ]);
    }
}