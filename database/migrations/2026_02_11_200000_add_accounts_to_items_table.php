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
        Schema::table('items', function (Blueprint $table) {
            $table->foreignId('inventory_account_id')->nullable()->after('status')->constrained('gl_accounts')->onDelete('set null');
            $table->foreignId('expense_account_id')->nullable()->after('inventory_account_id')->constrained('gl_accounts')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('items', function (Blueprint $table) {
            $table->dropForeign(['inventory_account_id']);
            $table->dropForeign(['expense_account_id']);
            $table->dropColumn(['inventory_account_id', 'expense_account_id']);
        });
    }
};
