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
        Schema::create('silabo', function (Blueprint $table) {
            $table->unsignedBigInteger('idCargaLectiva');
            $table->unsignedBigInteger('idFilial');
            $table->unsignedBigInteger('idDocente');
            $table->primary(['idCargaLectiva', 'idFilial','idDocente']);

            $table->string('documento'); 
            $table->boolean('estado'); 
            $table->string('observaciones'); 
            $table->foreignId('idDirector')->constrained('directorescuela', 'idDirector')->onDelete('cascade'); // Clave foránea

            $table->timestamps(4);

            $table->foreign('idCargaLectiva')->references('idCargaLectiva')->on('cargalectiva');
            $table->foreign('idFilial')->references('idFilial')->on('filial');
            $table->foreign('idDocente')->references('idDocente')->on('docente');

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('silabo');
    }
};
