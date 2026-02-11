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
        Schema::create('vendors', function (Blueprint $table) {
            $table->id();
            // Identity
            $table->string('code')->unique(); // e.g., VEN-0001
            $table->string('name');
            $table->string('email')->nullable();
            $table->string('phone')->nullable();

            // Address (Structured)
            $table->text('address_line1');
            $table->text('address_line2')->nullable();
            $table->string('city');
            $table->string('postal_code');
            $table->string('country')->default('ID');

            // Financial Profile
            $table->string('tax_id')->nullable(); // NPWP
            $table->boolean('is_pkp')->default(false);
            $table->string('currency_code', 3)->default('IDR');
            $table->integer('payment_term_days')->default(0); // 0 = COD/Cash, 30 = Net 30, etc.

            // Bank Details
            $table->string('bank_name')->nullable();
            $table->string('bank_account_number')->nullable();
            $table->string('bank_holder_name')->nullable();

            // Accounting Mapping
            $table->foreignId('payable_account_id')->nullable()->constrained('gl_accounts')->onDelete('set null');

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('vendors');
    }
};
