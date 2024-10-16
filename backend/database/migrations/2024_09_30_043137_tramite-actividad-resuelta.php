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
        Schema::create('TramiteActividadResuelta', function (Blueprint $table) {

            $table->unsignedBigInteger('idTramite');
            $table->unsignedBigInteger('idActividad');
            $table->unsignedBigInteger('idResultado');
            $table->primary(['idTramite', 'idActividad','idResultado']);
            $table->boolean('activo');
            $table->foreign('idTramite') ->references('id') ->on('Tramite') ;
            $table->foreign('idActividad') ->references('id') ->on('Actividad') ;
            $table->foreign('idResultado') ->references('id') ->on('Resultado');
            $table->integer('idProducto');
            $table->String('documento',255);
            $table->date('fechaInicio');
            $table->date('fechaPrograma');
            $table->date('fechaEjecucion');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('TramiteActividadResuelta');
    }
};
