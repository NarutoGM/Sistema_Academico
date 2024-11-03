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
        Schema::create('horarioaula', function (Blueprint $table) {
            $table->id('idHorario'); 
            $table->unsignedBigInteger('idCargaLectiva');
            $table->unsignedBigInteger('idFilial');
            $table->unsignedBigInteger('idDocente');
            $table->primary(['idHorario','idCargaLectiva', 'idFilial','idDocente']);
            $table->foreignId('idAula')->constrained('aula', 'idAula')->onDelete('cascade'); // Clave foránea

            $table->string('dia'); 
            $table->time('hInicio'); 
            $table->time('hTermino'); 

            $table->timestamps(4);
            $table->foreign('idCargaLectiva')->references('idCargaLectiva')->on('cargalectiva');
            $table->foreign('idFilial')->references('idFilial')->on('filial');
            $table->foreign('idDocente')->references('idDocente')->on('docente');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('horarioaula');
    }
};
