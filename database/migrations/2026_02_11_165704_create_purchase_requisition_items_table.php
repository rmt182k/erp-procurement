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
        Schema::create('pr_items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('purchase_requisition_id')->constrained('purchase_requisitions')->onDelete('cascade');
            $table->foreignUuid('item_id')->constrained('items')->onDelete('restrict');
            $table->integer('quantity');
            $table->decimal('estimated_unit_price', 15, 2);
            $table->decimal('subtotal', 15, 2);
            $table->string('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pr_items');
    }
};
