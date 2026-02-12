<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\DocumentTemplate;

class DocumentTemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $defaults = [
            'view_name' => 'modern',
            'template_mode' => 'Blade',
            'margin_top' => 45,    // Header Safe Area
            'margin_bottom' => 30, // Footer Safe Area
            'margin_left' => 15,
            'margin_right' => 15,
        ];

        // 1. Purchase Requisition Template
        DocumentTemplate::updateOrCreate(
            ['document_type' => 'PR'],
            array_merge($defaults, [
                'title_text' => 'Purchase Requisition',
                'title_color' => '#4f46e5',
            ])
        );

        // 2. Purchase Order Template
        DocumentTemplate::updateOrCreate(
            ['document_type' => 'PO'],
            array_merge($defaults, [
                'title_text' => 'Purchase Order',
                'title_color' => '#059669',
            ])
        );

        // 3. Invoice Template
        DocumentTemplate::updateOrCreate(
            ['document_type' => 'INV'],
            array_merge($defaults, [
                'title_text' => 'Invoice',
                'title_color' => '#1e293b',
            ])
        );

        // 4. Delivery Order Template
        DocumentTemplate::updateOrCreate(
            ['document_type' => 'DO'],
            array_merge($defaults, [
                'title_text' => 'Delivery Order',
                'title_color' => '#d97706',
            ])
        );
    }
}
