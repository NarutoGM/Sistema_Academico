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
        Schema::create('TramiteActividad', function (Blueprint $table) {
            $table->unsignedBigInteger('idTramite');
            $table->unsignedBigInteger('idActividad');
            $table->foreignId('idResponsable')->constrained('Responsable')->onDelete('cascade');
            $table->primary(['idTramite', 'idActividad']);
            $table->dateTime('FechaIngreso');
            $table->dateTime('FechaSalida')->nullable();
            $table->integer('PlazoEstandard');
            $table->integer('PlazoReal')->nullable();
            $table->text('Observacion')->nullable();
            $table->string('Resultado')->nullable();
            $table->string('Archivo')->nullable();
            $table->timestamps(4);

            $table->foreign('idTramite')->references('id')->on('Tramite');
            $table->foreign('idActividad')->references('id')->on('Actividad') ;
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('TramiteActividad');
    }
};
