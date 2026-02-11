<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseRequisitionItem extends Model
{
    use HasUuids;

    protected $table = 'pr_items';

    protected $fillable = [
        'purchase_requisition_id',
        'item_id',
        'quantity',
        'estimated_unit_price',
        'subtotal',
        'notes',
    ];

    protected $casts = [
        'estimated_unit_price' => 'decimal:2',
        'subtotal' => 'decimal:2',
    ];

    public function purchaseRequisition(): BelongsTo
    {
        return $this->belongsTo(PurchaseRequisition::class);
    }

    public function item(): BelongsTo
    {
        return $this->belongsTo(Item::class);
    }
}
