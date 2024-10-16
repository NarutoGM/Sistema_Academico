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
        Schema::create('ActividadResultado', function (Blueprint $table) {

        $table->unsignedBigInteger('idActividad');
        $table->unsignedBigInteger('idResultado');
        $table->primary(['idActividad', 'idResultado']);
        $table->boolean('activo');
        $table->foreign('idActividad') ->references('id') ->on('Actividad') ->onDelete('cascade');
        $table->foreign('idResultado') ->references('id') ->on('Resultado') ->onDelete('cascade');
    });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ActividadResultado');
    }
};
