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
        Schema::create('TramiteActividadRequisito', function (Blueprint $table) {

            $table->unsignedBigInteger('idTramite');
            $table->unsignedBigInteger('idActividad');
            $table->unsignedBigInteger('idRequisito');
            $table->primary(['idTramite','idActividad', 'idRequisito']);
            $table->boolean('activo');
            $table->foreign('idTramite') ->references('id') ->on('Tramite') ;
            $table->foreign('idActividad') ->references('id') ->on('Actividad')  ;
            $table->foreign('idRequisito') ->references('id') ->on('Requisito') ;
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('TramiteActividadRequisito');
    }
};
