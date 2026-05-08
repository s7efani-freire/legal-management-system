<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('condominiums', function (Blueprint $table) {
            $table->id();
            $table->string('corporate_name');
            $table->string('trade_name')->nullable();
            $table->string('cnpj', 18)->nullable();
            $table->string('email')->nullable();
            $table->string('phone', 20)->nullable();
            $table->string('zip_code', 10)->nullable();
            $table->string('street')->nullable();
            $table->integer('number')->nullable();
            $table->string('city')->nullable();
            $table->string('state', 2)->nullable();
            $table->string('condo_type')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('condominiums');
    }
};