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
            $table->unsignedBigInteger('idCargaDocente');
            $table->unsignedBigInteger('idFilial');
            $table->unsignedBigInteger('idDocente');
            $table->primary(['idCargaDocente', 'idFilial','idDocente']);
            $table->string('documento')->nullable(); 
            $table->boolean('activo')->nullable(); 
            $table->integer('estado')->nullable(); 
            $table->string('observaciones')->nullable(); 
            $table->dateTime('fEnvio')->nullable(); 
            $table->foreignId('idDirector')->nullable()->constrained('directorescuela', 'idDirector')->onDelete('cascade'); // Clave foránea
            $table->foreign('idCargaDocente')->references('idCargaDocente')->on('cargadocente');
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
