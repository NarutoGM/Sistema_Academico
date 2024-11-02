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
        Schema::create('curso', function (Blueprint $table) {
            $table->unsignedBigInteger('idCurso')->primary(); // Definir el campo como clave primaria sin auto-incremento
            $table->string('name');
            $table->integer('creditos')->nullable();
            $table->integer('hTeoricas')->nullable();
            $table->integer('hPracticas')->nullable();
            $table->integer('hRetroalimentacion')->nullable();
            $table->integer('hLaboratorio')->nullable();
            $table->integer('nGrupos')->nullable();
            $table->string('prerequisitos')->nullable();
            $table->foreignId('idDepartamento')->nullable()->constrained('departamentoacademico', 'idDepartamento')->onDelete('cascade');
            $table->foreignId('idFacultad')->nullable()->constrained('facultad', 'idFacultad')->onDelete('cascade');
            $table->foreignId('idArea')->nullable()->constrained('area', 'idArea')->onDelete('cascade');
            $table->foreignId('idRegimenCurso')->nullable()->constrained('regimencurso', 'idRegimenCurso')->onDelete('cascade');
            $table->foreignId('idTipoCurso')->nullable()->constrained('tipocurso', 'idTipoCurso')->onDelete('cascade');
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('curso');
    }
};
