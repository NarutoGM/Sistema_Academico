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
            $table->id('idCurso');
            $table->string('name');
            $table->integer('creditos');
            $table->string('hTeoricas');
            $table->string('hPracticas');
            $table->string('hLaboratorio');
            $table->integer('nGrupos');
            $table->foreignId('idDepartamento')->constrained('departamentoacademico', 'idDepartamento')->onDelete('cascade'); // Clave foránea

            $table->foreignId('idTipoCurso')->constrained('tipocurso', 'idTipoCurso')->onDelete('cascade'); // Especifica la columna primaria
            $table->timestamps(4);
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
