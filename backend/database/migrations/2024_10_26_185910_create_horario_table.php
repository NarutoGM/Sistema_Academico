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
        Schema::create('horario', function (Blueprint $table) {
            $table->unsignedBigInteger('idSemestreAcademico');
            $table->unsignedBigInteger('idFilial');
            $table->unsignedBigInteger('idEscuela');
            $table->primary(['idSemestreAcademico', 'idFilial','idEscuela']);
            $table->string('documento')->nullable(); 
            $table->boolean('estado')->nullable(); 
            $table->string('observaciones')->nullable(); 
            $table->foreignId('idDirector')->nullable()->constrained('directorescuela', 'idDirector')->onDelete('cascade'); // Clave foránea
            $table->foreign('idSemestreAcademico')->references('idSemestreAcademico')->on('semestreacademico');
            $table->foreign('idFilial')->references('idFilial')->on('filial');
            $table->foreign('idEscuela')->references('idEscuela')->on('escuela');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('horario');
    }
};
