<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApprovalStep extends Model
{
    use HasFactory;

    protected $fillable = [
        'approval_rule_id',
        'step_order',
        'role_name',
    ];

    public function rule()
    {
        return $this->belongsTo(ApprovalRule::class, 'approval_rule_id');
    }
}
