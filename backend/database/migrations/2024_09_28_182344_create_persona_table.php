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
        Schema::create('Persona', function (Blueprint $table) {
            $table->id(); 
            $table->unsignedBigInteger('idEspecialidad'); // También parte de la clave primaria
            $table->string('Nombres');
            $table->string('Apellidos');
            $table->string('DocIdentidad');
            $table->string('TipoDocIdentidad');
            $table->date('FechaNacim');
            $table->string('Email');
            $table->string('Celular');
            $table->string('Direccion');
            $table->string('Foto');

            // Definición de la clave primaria compuesta
            $table->primary(['id', 'idEspecialidad']);
            
            // Definición de las claves foráneas
            $table->foreign('idEspecialidad')
                  ->references('id')
                  ->on('Especialidad')
                  ->onDelete('cascade');

            $table->foreignId('idUser')
                  ->constrained('users')
                  ->onDelete('cascade');
            
            $table->timestamps(4);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Persona');
    }
};
