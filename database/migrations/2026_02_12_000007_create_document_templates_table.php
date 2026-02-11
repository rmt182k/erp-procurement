<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('document_templates', function (Blueprint $table) {
            $table->id();
            $table->string('document_type')->unique(); // PO, PR, INV, DO
            $table->enum('template_mode', ['Blade', 'Image', 'HTML'])->default('Blade');

            $table->string('view_name')->nullable(); // e.g., 'modern'
            $table->string('header_image_path')->nullable();
            $table->longText('header_content')->nullable(); // For HTML mode
            $table->longText('footer_content')->nullable();

            $table->integer('margin_top')->default(0); // in mm
            $table->integer('margin_bottom')->default(0);
            $table->integer('margin_left')->default(20);
            $table->integer('margin_right')->default(20);

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('document_templates');
    }
};
