<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DocumentTemplate extends Model
{
    protected $fillable = [
        'document_type',
        'template_mode',
        'view_name',
        'header_image_path',
        'branding_assets',
        'header_content',
        'footer_content',
        'margin_top',
        'margin_bottom',
        'margin_left',
        'margin_right',
        'title_color',
        'subtitle_color',
        'accent_color',
    ];

    protected $casts = [
        'margin_top' => 'integer',
        'margin_bottom' => 'integer',
        'margin_left' => 'integer',
        'margin_right' => 'integer',
        'branding_assets' => 'array',
    ];
}
