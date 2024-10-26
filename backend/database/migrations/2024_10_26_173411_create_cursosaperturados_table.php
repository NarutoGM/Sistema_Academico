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
        Schema::create('cursosaperturados', function (Blueprint $table) {
            $table->unsignedBigInteger('idSemestreAcademico');
            $table->unsignedBigInteger('idMalla');
            $table->unsignedBigInteger('idCurso');
            $table->unsignedBigInteger('idEscuela');
            $table->primary(['idSemestreAcademico','idMalla', 'idCurso', 'idEscuela']);

            $table->boolean('estado');  
            $table->foreign('idSemestreAcademico')->references('idSemestreAcademico')->on('semestreacademico');
            $table->foreign('idMalla')->references('idMalla')->on('malla');
            $table->foreign('idCurso')->references('idCurso')->on('curso');
            $table->foreign('idEscuela')->references('idEscuela')->on('escuela');

            $table->timestamps(4);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cursosaperturados');
    }
};
