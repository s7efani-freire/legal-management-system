<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Resident extends Model
{
    protected $fillable = [
        'first_name', 'last_name', 'document_number',
        'email', 'phone', 'phone_type',
    ];

    public function dwellings()
    {
        return $this->hasMany(Dwelling::class);
    }
}