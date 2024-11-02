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
        Schema::create('semestreacademico', function (Blueprint $table) {
            $table->id('idSemestreAcademico');
            $table->string('nomSemestre');  
            $table->string('añoAcademico');  
            $table->string('numSemestre');  
            $table->dateTime('fInicio');  
            $table->dateTime('fTermino');  
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('semestreacademico');
    }
};
