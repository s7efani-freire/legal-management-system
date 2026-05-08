<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name', 'first_name', 'last_name', 'cpf',
        'email', 'password', 'user_type', 'profile_photo_path', 'active',
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'active' => 'boolean',
    ];

    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'permission_user');
    }

    public function permissionNames(): array
    {
        return $this->permissions->pluck('name')->toArray();
    }
}