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
        Schema::create('mallas', function (Blueprint $table) {
            $table->id('idMalla'); // Columna idMalla como clave primaria
            $table->unsignedBigInteger('idEscuela'); // Columna idEscuela como clave foránea
            $table->string('año'); // Columna año como tipo varchar
            $table->timestamps(4);
            $table->primary(['idMalla', 'idEscuela']);

            // Definir la relación de clave foránea
            $table->foreign('idEscuela')->references('idEscuela')->on('escuelas')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mallas');
    }
};
