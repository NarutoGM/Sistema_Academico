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
        Schema::create('ActividadRequisito', function (Blueprint $table) {
            $table->unsignedBigInteger('idRequisito');
            $table->unsignedBigInteger('idActividad');
            $table->primary(['idRequisito', 'idActividad']);
            $table->boolean('activo');
            $table->timestamps();
            $table->foreign('idActividad') ->references('id') ->on('Actividad') ->onDelete('cascade');
            $table->foreign('idRequisito') ->references('id') ->on('Requisito') ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ActividadRequisito');
    }
};
