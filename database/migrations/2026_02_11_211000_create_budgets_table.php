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
        Schema::create('budgets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('cost_center_id')->constrained()->onDelete('cascade');
            $table->foreignId('gl_account_id')->constrained()->onDelete('restrict');
            $table->integer('fiscal_year');
            $table->decimal('amount_allocated', 15, 2);
            $table->decimal('amount_reserved', 15, 2)->default(0);
            $table->decimal('amount_used', 15, 2)->default(0);
            $table->timestamps();

            $table->unique(['cost_center_id', 'gl_account_id', 'fiscal_year'], 'unique_budget_entry');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('budgets');
    }
};
