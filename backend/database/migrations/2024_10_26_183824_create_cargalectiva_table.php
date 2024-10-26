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
        Schema::create('cargalectiva', function (Blueprint $table) {
            $table->id('idCargaLectiva')->unique();
            $table->unsignedBigInteger('idFilial');
            $table->unsignedBigInteger('idDocente');
            $table->primary(['idCargaLectiva','idFilial', 'idDocente']);
            $table->dateTime('fAsignacion'); 
            $table->boolean('estado'); 

            $table->foreignId('idSemestreAcademico')->constrained('semestreacademico', 'idSemestreAcademico')->onDelete('cascade'); // Clave foránea
            $table->foreignId('idMalla')->constrained('malla', 'idMalla')->onDelete('cascade'); // Clave foránea
            $table->foreignId('idCurso')->constrained('curso', 'idCurso')->onDelete('cascade'); // Clave foránea
            $table->foreignId('idEscuela')->constrained('escuela', 'idEscuela')->onDelete('cascade'); // Clave foránea

            $table->timestamps(4);
            $table->foreign('idFilial')->references('idFilial')->on('filial') ;
            $table->foreign('idDocente')->references('idDocente')->on('docente') ;

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cargalectiva');
    }
};
