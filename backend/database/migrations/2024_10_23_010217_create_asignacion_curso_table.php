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
        Schema::create('asignacion_curso', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id'); // Clave foránea de la tabla users
            $table->unsignedBigInteger('idMalla'); // Clave foránea idMalla
            $table->unsignedBigInteger('idCurso'); // Clave foránea idCurso
            $table->unsignedBigInteger('idEscuela'); // Clave foránea idEscuela
            $table->timestamps(4);
        
            // Definir la clave primaria compuesta
            $table->primary(['user_id', 'idMalla', 'idCurso', 'idEscuela']);
        
            // Definir las relaciones de claves foráneas
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade'); // Referencia a users
        
            // Referencia a la combinación de idMalla, idCurso y idEscuela en plan_curso_academico
            $table->foreign(['idMalla', 'idCurso', 'idEscuela'])
                  ->references(['idMalla', 'idCurso', 'idEscuela'])
                  ->on('plan_curso_academico')
                  ->onDelete('cascade');
        
            $table->foreign('idCurso')->references('idCurso')->on('cursos')->onDelete('cascade');
            $table->foreign('idEscuela')->references('idEscuela')->on('escuelas')->onDelete('cascade');
        });
        
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asignacion_curso');
    }
};
