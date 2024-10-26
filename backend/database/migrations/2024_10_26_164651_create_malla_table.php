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
        Schema::create('malla', function (Blueprint $table) {
            $table->id('idMalla');
            $table->unsignedBigInteger('idEscuela');
            $table->primary('idMalla','idEscuela');
            $table->string('año');
            $table->boolean('estado');
            $table->timestamps(4);
            $table->foreign('idEscuela')->references('idEscuela')->on('escuela');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('malla');
    }
};
