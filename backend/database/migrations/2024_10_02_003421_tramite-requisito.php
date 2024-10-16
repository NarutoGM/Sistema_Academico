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
        Schema::create('TramiteRequisito', function (Blueprint $table) {

            $table->unsignedBigInteger('idTramite');
            $table->unsignedBigInteger('idRequisito');
            $table->primary(['idTramite', 'idRequisito']);
            $table->String('document',255);
            $table->foreign('idTramite') ->references('id') ->on('Tramite') ->onDelete('cascade'); ;
            $table->foreign('idRequisito') ->references('id') ->on('Requisito') ->onDelete('cascade'); ;
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('TramiteRequisito');
    }
};
