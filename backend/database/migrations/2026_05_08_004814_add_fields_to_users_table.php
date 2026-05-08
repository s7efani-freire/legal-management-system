<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::table('users', function (Blueprint $table) {
            $table->string('first_name')->nullable()->after('id');
            $table->string('last_name')->nullable()->after('first_name');
            $table->string('cpf', 14)->nullable()->after('last_name');
            $table->string('user_type')->default('LAWYER')->after('cpf');
            $table->string('profile_photo_path')->nullable()->after('user_type');
            $table->boolean('active')->default(true)->after('profile_photo_path');
        });
    }

    public function down(): void {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['first_name', 'last_name', 'cpf', 'user_type', 'profile_photo_path', 'active']);
        });
    }
};