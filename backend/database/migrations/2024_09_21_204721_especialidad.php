<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('Especialidad', function (Blueprint $table) {
            $table->id(); 
            $table->string('Descripcion');
            $table->boolean('AsesorFree');
            $table->unsignedBigInteger('idResponsableArea');
            $table->unsignedBigInteger('idResponsableSecretaria');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Especialidad');
    }
};
