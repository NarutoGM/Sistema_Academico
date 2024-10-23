<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('plan_curso_academico', function (Blueprint $table) {
            $table->unsignedBigInteger('idMalla'); // Clave foránea idMalla
            $table->unsignedBigInteger('idCurso'); // Clave foránea idCurso
            $table->unsignedBigInteger('idEscuela'); // Clave foránea idEscuela
            $table->enum('periodo', ['I', 'II']); // Columna periodo con valores I o II
            $table->string('ciclo'); // Columna ciclo, podría ser I, II, III, etc.
            $table->timestamps(4);
        
            // Definir la clave primaria compuesta
            $table->primary(['idMalla', 'idCurso', 'idEscuela']);
        
            // Agregar un índice único para idMalla y idEscuela
            $table->unique(['idMalla', 'idEscuela'], 'unique_malla_escuela');
        
            // Definir relaciones de claves foráneas
            $table->foreign(['idMalla', 'idEscuela'])
                  ->references(['idMalla', 'idEscuela'])
                  ->on('mallas')
                  ->onDelete('cascade');
        
            $table->foreign('idCurso')->references('idCurso')->on('cursos')->onDelete('cascade');
        });
        
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plan_curso_academico');
    }
};
