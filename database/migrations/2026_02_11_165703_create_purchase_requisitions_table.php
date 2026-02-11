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
        Schema::create('purchase_requisitions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('doc_number')->unique();
            $table->foreignId('procurement_type_id')->constrained('procurement_types')->onDelete('restrict');
            $table->foreignId('requester_id')->constrained('users')->onDelete('restrict');
            $table->foreignId('cost_center_id')->constrained('cost_centers')->onDelete('restrict');
            $table->foreignId('org_node_id')->nullable()->constrained('org_nodes')->onDelete('set null');

            $table->text('description')->nullable();
            $table->decimal('total_estimated_amount', 15, 2)->default(0);
            $table->enum('status', ['DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'ORDERED'])->default('DRAFT');

            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('purchase_requisitions');
    }
};
