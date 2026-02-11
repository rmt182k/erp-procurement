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
        Schema::create('document_approvals', function (Blueprint $table) {
            $table->id();
            $table->morphs('document'); // document_type & document_id
            $table->foreignId('approval_step_id')->nullable()->constrained()->nullOnDelete();
            $table->integer('step_order');

            // Snapshot of the role name needed at this step
            $table->string('role_name');

            // Who actually approved it
            $table->foreignId('approver_id')->nullable()->constrained('users');

            $table->enum('status', ['WAITING', 'PENDING', 'APPROVED', 'REJECTED'])->default('WAITING');
            $table->text('remarks')->nullable();

            $table->timestamp('approved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('document_approvals');
    }
};
