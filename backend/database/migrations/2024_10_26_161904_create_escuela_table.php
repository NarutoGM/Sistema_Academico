<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('escuela', function (Blueprint $table) {
            $table->id('idEscuela');
            $table->string('name'); 
            $table->foreignId('idFacultad')->constrained('facultad', 'idFacultad')->onDelete('cascade'); // Clave foránea
        });        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('escuela');
    }
};
