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
        $assets = $template?->branding_assets ?? [];
        foreach ($assets as &$asset) {
            if (isset($asset['path']) && $asset['path']) {
                $p = storage_path('app/public/' . $asset['path']);
                if (file_exists($p)) {
                    $type = pathinfo($p, PATHINFO_EXTENSION);
                    $data = file_get_contents($p);
                    $asset['base64'] = 'data:image/' . $type . ';base64,' . base64_encode($data);
                }
            }
        }

        // Default Title based on DocType
        $defaultTitle = $this->getDefaultTitle($docType);

        $headerImagePath = ($template && $template->header_image_path) ? storage_path('app/public/' . $template->header_image_path) : null;
        $headerImageBase64 = null;
        if ($headerImagePath && file_exists($headerImagePath)) {
            $type = pathinfo($headerImagePath, PATHINFO_EXTENSION);
            $data = file_get_contents($headerImagePath);
            $headerImageBase64 = 'data:image/' . $type . ';base64,' . base64_encode($data);
        }

        $branding = [
            'mode' => $template->template_mode ?? 'Blade',
            'header_image' => $headerImageBase64,
            'branding_assets' => $assets,
            'header_html' => $template->header_content ?? null,
            'footer_html' => $template->footer_content ?? null,
            'title_text' => $template->title_text ?? $defaultTitle,
            'title_color' => $template->title_color ?? '#000000',
            'subtitle_color' => $template->subtitle_color ?? '#64748b',
            'accent_color' => $template->accent_color ?? '#16a34a',
            'margins' => [
                'top' => $template->margin_top ?? 10,
                'bottom' => $template->margin_bottom ?? 10,
                'left' => $template->margin_left ?? 15,
                'right' => $template->margin_right ?? 15,
            ]
        ];

        // 3. Resolve View Name
        $finalView = $viewName;
        if ($template && $template->view_name) {
            // viewName comes in as 'pdf.po.modern'. We want to swap 'modern' with the user's choice.
            $parts = explode('.', $viewName);
            array_pop($parts); // Remove the last part (e.g., 'modern')
            $customView = implode('.', $parts) . '.' . $template->view_name;

            // Only use custom view if it actually exists in the filesystem
            if (View::exists($customView)) {
                $finalView = $customView;
            }
        }

        // 4. Render the PDF using a master layout that injects the branding
        return Pdf::loadView('pdf.master_layout', [
            'content_view' => $finalView,
            'data' => $data,
            'branding' => $branding,
        ]);
    }

    private function getDefaultTitle(string $docType): string
    {
        return match (strtoupper($docType)) {
            'PR' => 'Purchase Requisition',
            'PO' => 'Purchase Order',
            'INV' => 'Invoice',
            'DO' => 'Delivery Order',
            default => 'Document',
        };
    }
}
