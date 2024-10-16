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
        Schema::create('Actividad', function (Blueprint $table) {
            $table->id(); 
            $table->string('Actividad');
            $table->boolean('ConRequisito');
            $table->boolean('ConResultado');
            $table->integer('plazo');
            $table->integer('orden');
            $table->foreignId('idFlujo')->constrained('Flujo')->onDelete('cascade');
            $table->foreignId('idRol')->constrained('roles')->onDelete('cascade');
            $table->timestamps(4);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Actividad');
    }
};
