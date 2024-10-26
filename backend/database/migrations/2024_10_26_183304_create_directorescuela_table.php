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
        Schema::create('directorescuela', function (Blueprint $table) {
            $table->id('idDirector');
            $table->foreignId('id')->constrained('users', 'id')->onDelete('cascade'); // Clave foránea
            $table->foreignId('idEscuela')->constrained('escuela', 'idEscuela')->onDelete('cascade'); // Clave foránea

            $table->timestamps(4);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('directorescuela');
    }
};
