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
        Schema::create('Flujo', function (Blueprint $table) {
            $table->id(); 
            $table->string('Flujo');
            $table->integer('PlazoTotal');
            $table->string('idProducto');
            $table->string('Formato');
            $table->timestamps(4);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Flujo');
    }
};
