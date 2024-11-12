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
        Schema::create('plancursoacademico', function (Blueprint $table) {
            $table->unsignedBigInteger('idMalla');
            $table->unsignedBigInteger('idCurso');
            $table->unsignedBigInteger('idEscuela');
            $table->primary(['idMalla', 'idCurso', 'idEscuela']);
            $table->string('ciclo');  // I - X
            $table->boolean('estado'); 
            $table->string('prerequisitos')->nullable();
 
            $table->foreign('idMalla')->references('idMalla')->on('malla') ;
            $table->foreign('idCurso')->references('idCurso')->on('curso') ;
            $table->foreign('idEscuela')->references('idEscuela')->on('escuela') ;
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('plancursoacademico');
    }
};
