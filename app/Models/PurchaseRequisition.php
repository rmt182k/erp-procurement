<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphMany;

class PurchaseRequisition extends Model
{
    use HasUuids, SoftDeletes;

    const STATUS_DRAFT = 'DRAFT';
    const STATUS_SUBMITTED = 'SUBMITTED';
    const STATUS_APPROVED = 'APPROVED';
    const STATUS_REJECTED = 'REJECTED';
    const STATUS_ORDERED = 'ORDERED';
    const STATUS_CANCELLED = 'CANCELLED';

    protected $fillable = [
        'doc_number',
        'procurement_type_id',
        'requester_id',
        'cost_center_id',
        'org_node_id',
        'suggested_vendor_id',
        'required_date',
        'description',
        'total_estimated_amount',
        'status',
        'cancel_reason',
    ];

    protected $casts = [
        'required_date' => 'date',
        'total_estimated_amount' => 'decimal:2',
    ];

    public function procurementType(): BelongsTo
    {
        return $this->belongsTo(ProcurementType::class);
    }

    public function requester(): BelongsTo
    {
        return $this->belongsTo(User::class, 'requester_id');
    }

    public function costCenter(): BelongsTo
    {
        return $this->belongsTo(CostCenter::class);
    }

    public function department(): BelongsTo
    {
        return $this->belongsTo(OrgNode::class, 'org_node_id');
    }

    public function suggestedVendor(): BelongsTo
    {
        return $this->belongsTo(Vendor::class, 'suggested_vendor_id');
    }

    public function items(): HasMany
    {
        return $this->hasMany(PurchaseRequisitionItem::class);
    }

    /**
     * Relationship to Approval Engine
     */
    public function approvals(): MorphMany
    {
        return $this->morphMany(DocumentApproval::class, 'document');
    }

    public function isEditable(): bool
    {
        return $this->status === self::STATUS_DRAFT;
    }

    public function isSubmitted(): bool
    {
        return $this->status === self::STATUS_SUBMITTED;
    }
}
