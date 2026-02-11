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
        Schema::create('items', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('category_id')->constrained('item_categories')->onDelete('cascade');
            $table->foreignUuid('unit_id')->constrained('item_units')->onDelete('cascade');
            $table->string('code')->unique();
            $table->string('name');
            $table->decimal('price', 15, 2);
            $table->decimal('stock', 15, 2)->default(0);
            $table->text('description')->nullable();
            $table->string('status')->default('active'); // active, inactive
            $table->foreignId('inventory_account_id')->nullable()->constrained('gl_accounts')->onDelete('set null');
            $table->foreignId('expense_account_id')->nullable()->constrained('gl_accounts')->onDelete('set null');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
