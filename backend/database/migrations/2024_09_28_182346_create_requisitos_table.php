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
        Schema::create('Requisito', function (Blueprint $table) {
            $table->id(); 
            $table->string('Requisito');
            $table->boolean('DebeValidarse');
            $table->timestamps(4);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('Requisito');
    }
};
