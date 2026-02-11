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
        // 1. Approval Rules Header
        Schema::create('approval_rules', function (Blueprint $table) {
            $table->id();
            $table->string('doc_type'); // e.g., 'PurchaseOrder'
            $table->decimal('min_amount', 15, 2);
            $table->decimal('max_amount', 15, 2);
            $table->string('currency', 3)->default('IDR');
            $table->integer('priority')->default(0);
            $table->timestamps();
        });

        // 2. Approval Steps (The Route)
        Schema::create('approval_steps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('approval_rule_id')->constrained()->cascadeOnDelete();
            $table->integer('step_order'); // 1, 2, 3...
            $table->string('role_name'); // e.g., 'manager' (Snapshot identifier)
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('approval_steps');
        Schema::dropIfExists('approval_rules');
    }
};
