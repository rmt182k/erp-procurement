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
            'header_image' => 'nullable|image|max:2048', // Legacy support
            'header_content' => 'nullable|string',
            'footer_content' => 'nullable|string',
            'margin_top' => 'required|integer|min:0',
            'margin_bottom' => 'required|integer|min:0',
            'margin_left' => 'required|integer|min:0',
            'margin_right' => 'required|integer|min:0',
            'branding_assets' => 'nullable|array',
            'branding_assets.*.top' => 'nullable|numeric',
            'branding_assets.*.left' => 'nullable|numeric',
            'branding_assets.*.width' => 'nullable|numeric',
            'branding_assets.*.height' => 'nullable|string', // 'auto' or numeric
            'branding_assets.*.opacity' => 'nullable|numeric',
            'branding_assets.*.file' => 'nullable|file|image|max:2048',
            'branding_assets.*.path' => 'nullable|string',
        ]);

        // 0. Get old assets for comparison to clean up files
        $template = DocumentTemplate::where('document_type', $docType)->first();
        $oldAssets = $template ? ($template->branding_assets ?? []) : [];
        $oldPaths = array_filter(array_column($oldAssets, 'path'));

        // 1. Storage Processing
        $assets = $request->input('branding_assets', []);
        $newPaths = array_filter(array_column($assets, 'path'));

        foreach ($assets as $index => &$asset) {
            if ($request->hasFile("branding_assets.{$index}.file")) {
                $path = $request->file("branding_assets.{$index}.file")->store('branding', 'public');
                $asset['path'] = $path;
                $newPaths[] = $path;
                unset($asset['file']);
            }
        }

        // Clean up physically removed files
        $pathsToDelete = array_diff($oldPaths, $newPaths);
        foreach ($pathsToDelete as $path) {
            if ($path) Storage::disk('public')->delete($path);
        }

        $template = DocumentTemplate::updateOrCreate(
            ['document_type' => $docType],
            array_merge($validated, ['branding_assets' => $assets])
        );

        if ($request->hasFile('header_image')) {
            if ($template->header_image_path) {
                Storage::disk('public')->delete($template->header_image_path);
            }
            $path = $request->file('header_image')->store('branding', 'public');
            $template->update(['header_image_path' => $path]);
        }

        return redirect()->back()->with('success', "{$docType} layout updated successfully.");
    }
}
