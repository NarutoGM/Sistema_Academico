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
        Schema::create('RolPermiso', function (Blueprint $table) {

            $table->unsignedBigInteger('idRol');
            $table->unsignedBigInteger('idPermiso');
            $table->primary(['idRol','idPermiso']);
            $table->boolean('estado');
            $table->foreign('idRol') ->references('id') ->on('roles') ->onDelete('cascade');;
            $table->foreign('idPermiso') ->references('id') ->on('Permiso') ->onDelete('cascade'); ;
            $table->timestamps(4);

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('RolPermiso');
    }
};
