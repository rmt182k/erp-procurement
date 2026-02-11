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
        // 1. Roles Table
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., 'manager', 'supervisor'
            $table->string('label'); // e.g., 'Manager', 'Supervisor'
            $table->timestamps();
        });

        // 2. Permissions Table
        Schema::create('permissions', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique(); // e.g., 'po.approve', 'po.create'
            $table->timestamps();
        });

        // 3. Model Has Roles (User <-> Role)
        Schema::create('model_has_roles', function (Blueprint $table) {
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->morphs('model'); // model_id (user_id) & model_type (App\Models\User)
            $table->primary(['role_id', 'model_id', 'model_type']);
        });

        // 4. Role Has Permissions (Role <-> Permission)
        Schema::create('role_has_permissions', function (Blueprint $table) {
            $table->foreignId('permission_id')->constrained()->cascadeOnDelete();
            $table->foreignId('role_id')->constrained()->cascadeOnDelete();
            $table->primary(['permission_id', 'role_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('role_has_permissions');
        Schema::dropIfExists('model_has_roles');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
    }
};
