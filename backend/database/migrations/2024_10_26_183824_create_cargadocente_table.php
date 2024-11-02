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
        Schema::create('cargadocente', function (Blueprint $table) {
            $table->id('idCargaDocente')->unique();
            $table->unsignedBigInteger('idFilial');
            $table->unsignedBigInteger('idDocente');
            $table->primary(['idCargaDocente','idFilial', 'idDocente']);
            $table->dateTime('fAsignacion')->nullable(); 
            $table->boolean('estado')->nullable(); 
            $table->string('grupo')->nullable(); // A - B
            $table->foreignId('idSemestreAcademico')->constrained('semestreacademico', 'idSemestreAcademico')->onDelete('cascade'); // Clave foránea
            $table->foreignId('idMalla')->constrained('malla', 'idMalla')->onDelete('cascade'); // Clave foránea
            $table->foreignId('idCurso')->constrained('curso', 'idCurso')->onDelete('cascade'); // Clave foránea
            $table->foreignId('idEscuela')->constrained('escuela', 'idEscuela')->onDelete('cascade'); // Clave foránea
            $table->foreign('idFilial')->references('idFilial')->on('filial') ;
            $table->foreign('idDocente')->references('idDocente')->on('docente') ;
            $table->foreignId('idDirector')->nullable()->constrained('directorescuela', 'idDirector')->onDelete('cascade'); // Clave foránea

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cargadocente');
    }
};
