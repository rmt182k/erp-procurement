<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('purchase_orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('doc_number')->unique();
            $table->foreignId('procurement_type_id')->constrained();
            $table->foreignId('vendor_id')->constrained();
            $table->foreignId('cost_center_id')->constrained();
            $table->string('status')->default('DRAFT'); // DRAFT, SUBMITTED, APPROVED, REJECTED, ISSUED, CANCELLED

            $table->date('order_date');
            $table->date('delivery_date')->nullable();

            // Financials (Snapshots)
            $table->string('currency_code');
            $table->decimal('exchange_rate', 15, 6);
            $table->decimal('subtotal', 15, 2);
            $table->decimal('tax_amount', 15, 2);
            $table->decimal('discount_amount', 15, 2)->default(0);
            $table->decimal('grand_total', 15, 2);

            $table->text('notes')->nullable();
            $table->text('shipping_address')->nullable();

            $table->foreignId('created_by')->constrained('users');
            $table->foreignId('approved_by')->nullable()->constrained('users');

            $table->timestamps();
            $table->softDeletes();

            $table->foreign('currency_code')->references('code')->on('currencies');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('purchase_orders');
    }
};
