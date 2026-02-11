<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\DocumentTemplate;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Storage;

class DocumentTemplateController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/DocumentLayouts/Index', [
            'templates' => DocumentTemplate::all()->keyBy('document_type'),
        ]);
    }

    public function update(Request $request, string $docType)
    {
        $validated = $request->validate([
            'template_mode' => 'required|in:Blade,Image,HTML',
            'view_name' => 'nullable|string',
            'header_image' => 'nullable|image|max:2048',
            'header_content' => 'nullable|string',
            'footer_content' => 'nullable|string',
            'margin_top' => 'required|integer|min:0',
            'margin_bottom' => 'required|integer|min:0',
            'margin_left' => 'required|integer|min:0',
            'margin_right' => 'required|integer|min:0',
        ]);

        $template = DocumentTemplate::updateOrCreate(
            ['document_type' => $docType],
            $validated
        );

        if ($request->hasFile('header_image')) {
            // Delete old image if exists
            if ($template->header_image_path) {
                Storage::disk('public')->delete($template->header_image_path);
            }

            $path = $request->file('header_image')->store('branding', 'public');
            $template->update(['header_image_path' => $path]);
        }

        return redirect()->back()->with('success', "{$docType} layout updated successfully.");
    }
}
