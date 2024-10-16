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
        Schema::create('FlujoRequisito', function (Blueprint $table) {
            $table->unsignedBigInteger('idFlujo');
            $table->unsignedBigInteger('idRequisito');
            $table->primary(['idFlujo', 'idRequisito']);
            $table->boolean('activo');
            $table->timestamps();
            $table->foreign('idFlujo') ->references('id') ->on('Flujo') ->onDelete('cascade');
            $table->foreign('idRequisito') ->references('id') ->on('Requisito') ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('FlujoRequisito');
    }
};
