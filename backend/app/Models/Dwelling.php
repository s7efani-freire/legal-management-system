<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Dwelling extends Model
{
    protected $fillable = [
        'resident_id', 'condominium_id', 'unit_number', 'building_block',
    ];

    public function condominium()
    {
        return $this->belongsTo(Condominium::class);
    }
}