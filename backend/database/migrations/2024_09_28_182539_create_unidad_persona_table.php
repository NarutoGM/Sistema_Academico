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
        Schema::create('UnidadPersona', function (Blueprint $table) {
            $table->unsignedBigInteger('idPersona');
            $table->unsignedBigInteger('idEspecialidad');
            $table->unsignedBigInteger('idUnidad');
            $table->primary(['idPersona', 'idEspecialidad', 'idUnidad']);
            $table->boolean('Activo');
            $table->date('FechaInicio');
            $table->timestamps();

            // Definición de las claves foráneas
            $table->foreign(['idPersona', 'idEspecialidad'])
                  ->references(['id', 'idEspecialidad'])
                  ->on('Persona')
                  ->onDelete('cascade');

            $table->foreign('idUnidad')
                  ->references('id')
                  ->on('Unidad')
                  ->onDelete('cascade');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('UnidadPersona');
    }
};
