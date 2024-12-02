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
        Schema::create('asignacion', function (Blueprint $table) {
            $table->id('idAsignacion');
            $table->unsignedBigInteger('idCargaDocente');
            $table->unsignedBigInteger('idFilial');
            $table->unsignedBigInteger('idDocente');
            $table->primary(['idAsignacion', 'idCargaDocente', 'idFilial','idDocente']);
            $table->foreignId('idHorario')->constrained('horario', 'idHorario');
            $table->foreignId('idAula')->constrained('aula', 'idAula');
            $table->string('grupo')->nullable();
            $table->string('tipoSesion');
            $table->foreign('idCargaDocente')->references('idCargaDocente')->on('cargadocente');
            $table->foreign('idFilial')->references('idFilial')->on('filial');
            $table->foreign('idDocente')->references('idDocente')->on('docente');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asignacion');
    }
};
