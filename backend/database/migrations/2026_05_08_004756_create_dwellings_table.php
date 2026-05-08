<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void {
        Schema::create('dwellings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('resident_id')->constrained()->onDelete('cascade');
            $table->foreignId('condominium_id')->constrained()->onDelete('cascade');
            $table->string('unit_number');
            $table->string('building_block')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void {
        Schema::dropIfExists('dwellings');
    }
};