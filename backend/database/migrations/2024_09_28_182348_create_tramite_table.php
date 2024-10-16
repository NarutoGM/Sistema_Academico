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
        Schema::create('Tramite', function (Blueprint $table) {
            $table->id(); 
            $table->dateTime('FechaHoraPresentacion');
            $table->dateTime('FechaHoraEntregaProg');
            $table->dateTime('FechaHoraEntregaReal')->nullable();
            
            $table->unsignedBigInteger('idPersona'); // Asegúrate de que este tipo coincida con el tipo de 'id' en Persona
            $table->unsignedBigInteger('idEspecialidad'); // También necesitas este para la referencia
            
            // Agregar las claves foráneas
            $table->foreign(['idPersona', 'idEspecialidad'])
                  ->references(['id', 'idEspecialidad']) // Referencia a ambas columnas de Persona
                  ->on('Persona')
                  ->onDelete('cascade');
            
            $table->foreignId('idUnidad')->constrained('Unidad')->onDelete('cascade');
            $table->foreignId('idFlujo')->constrained('Flujo')->onDelete('cascade');
            $table->text('Observaciones')->nullable();
            $table->string('idProducto')->nullable();
            $table->timestamps(4);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Tramite');
    }
};
