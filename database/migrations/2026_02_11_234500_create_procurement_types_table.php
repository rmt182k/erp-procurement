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
        Schema::create('procurement_types', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique(); // STD, SVC, AST
            $table->string('name');
            $table->text('description')->nullable();

            // --- THE LOGIC SWITCHES ---
            $table->boolean('require_pr')->default(true);
            $table->boolean('require_rfq')->default(false);
            $table->boolean('require_grn')->default(true);

            // --- IMPACT FLAGS ---
            $table->boolean('track_inventory')->default(true); // Nambah stok?
            $table->boolean('is_service')->default(false);     // Filter item jasa?
            $table->boolean('is_asset')->default(false);       // Masuk register aset?

            $table->boolean('is_active')->default(true);
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('procurement_types');
    }
};
