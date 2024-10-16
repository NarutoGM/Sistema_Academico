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

        Schema::create('Unidad', function (Blueprint $table) {
            $table->id(); 
            $table->string('unidad'); 
            $table->timestamps(4); 
        });       

        Schema::create('Responsable', function (Blueprint $table) {
            $table->id(); 
            $table->string('apellidos'); 
            $table->string('nombres'); 
            $table->string('firmadigital'); 
            $table->string('clavedigital'); 
            $table->foreignId('idRol')->constrained('roles')->onDelete('cascade');
            $table->foreignId('idUnidad')->constrained('Unidad')->onDelete('cascade');
            $table->timestamps(4);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Responsable');
        Schema::dropIfExists('Unidad');
    }
};