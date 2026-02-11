<?php

namespace App\Services;

use App\Models\DocumentTemplate;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\View;

class PdfService
{
    /**
     * Load a document view with branding settings.
     */
    public function loadView(string $docType, string $viewName, array $data)
    {
        // 1. Fetch template settings for this document type (e.g., 'PO')
        $template = DocumentTemplate::where('document_type', $docType)->first();

        // 2. Prepare Template Data
        $branding = [
            'mode' => $template->template_mode ?? 'Blade',
            'header_image' => $template->header_image_path ? public_path('storage/' . $template->header_image_path) : null,
            'header_html' => $template->header_content,
            'footer_html' => $template->footer_content,
            'margins' => [
                'top' => $template->margin_top ?? 0,
                'bottom' => $template->margin_bottom ?? 0,
                'left' => $template->margin_left ?? 15,
                'right' => $template->margin_right ?? 15,
            ]
        ];

        // 3. Render the PDF using a master layout that injects the branding
        return Pdf::loadView('pdf.master_layout', [
            'content_view' => $viewName,
            'data' => $data,
            'branding' => $branding,
        ]);
    }
}
