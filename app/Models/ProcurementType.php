<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ProcurementType extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'code',
        'name',
        'description',
        'require_pr',
        'require_rfq',
        'require_grn',
        'track_inventory',
        'is_service',
        'is_asset',
        'is_active',
    ];

    protected $casts = [
        'require_pr' => 'boolean',
        'require_rfq' => 'boolean',
        'require_grn' => 'boolean',
        'track_inventory' => 'boolean',
        'is_service' => 'boolean',
        'is_asset' => 'boolean',
        'is_active' => 'boolean',
    ];
}
