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

        // 3. Resolve View Name
        // If mode is Blade, we try to use the specific preset chosen in the template settings
        $finalView = $viewName;
        if ($branding['mode'] === 'Blade' && $template && $template->view_name) {
            // viewName comes in as 'pdf.po.modern'. We want to swap 'modern' with the user's choice.
            $parts = explode('.', $viewName);
            array_pop($parts); // Remove the last part (e.g., 'modern')
            $finalView = implode('.', $parts) . '.' . $template->view_name;
        }

        // 4. Render the PDF using a master layout that injects the branding
        return Pdf::loadView('pdf.master_layout', [
            'content_view' => $finalView,
            'data' => $data,
            'branding' => $branding,
        ]);
    }
}
