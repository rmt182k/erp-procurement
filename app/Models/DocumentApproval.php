<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class DocumentApproval extends Model
{
    use HasFactory;

    protected $fillable = [
        'document_type',
        'document_id',
        'approval_step_id',
        'step_order',
        'role_name',
        'approver_id',
        'status',
        'remarks',
        'approved_at',
    ];

    protected $casts = [
        'approved_at' => 'datetime',
    ];

    public function document()
    {
        return $this->morphTo();
    }

    public function approver()
    {
        return $this->belongsTo(User::class, 'approver_id');
    }

    public function step()
    {
        return $this->belongsTo(ApprovalStep::class, 'approval_step_id');
    }
}
