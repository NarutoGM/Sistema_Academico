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
        Schema::create('semana', function (Blueprint $table) {
            $table->id('idSemana')->unique();

            $table->unsignedBigInteger('idCargaDocente');
            $table->unsignedBigInteger('idFilial');
            $table->unsignedBigInteger('idDocente');
            $table->primary(['idSemana','idCargaDocente', 'idFilial','idDocente']);

            $table->text('organizacion')->nullable(); 
            $table->text('estrategias')->nullable(); 
            $table->text('evidencias')->nullable(); 
            $table->text('instrumentos')->nullable(); 
            $table->text('nomSem')->nullable(); 

            
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
        Schema::dropIfExists('semana');
    }
};
