<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApprovalRule extends Model
{
    use HasFactory;

    protected $fillable = [
        'doc_type',
        'min_amount',
        'max_amount',
        'currency',
        'priority',
    ];

    protected $casts = [
        'min_amount' => 'decimal:2',
        'max_amount' => 'decimal:2',
    ];

    public function steps()
    {
        return $this->hasMany(ApprovalStep::class)->orderBy('step_order');
    }
}
