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
        
        Schema::create('docentefilial', function (Blueprint $table) {
            $table->unsignedBigInteger('idFilial');
            $table->unsignedBigInteger('idDocente');
            $table->primary(['idFilial', 'idDocente']);
            $table->foreignId('idCondicion')->nullable()->constrained('condicion', 'idCondicion')->onDelete('cascade'); // Clave foránea
            $table->foreignId('idRegimen')->nullable()->constrained('regimen', 'idRegimen')->onDelete('cascade'); // Clave foránea
            $table->foreignId('idCategoria')->nullable()->constrained('categorias', 'idCategoria')->onDelete('cascade'); // Clave foránea
            $table->boolean('estado')->nullable(); 
            $table->foreign('idFilial')->references('idFilial')->on('filial') ;
            $table->foreign('idDocente')->references('idDocente')->on('docente') ;
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('docentefilial');
    }
};
