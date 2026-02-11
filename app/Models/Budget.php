<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Budget extends Model
{
    use HasFactory;

    protected $fillable = [
        'cost_center_id',
        'gl_account_id',
        'fiscal_year',
        'amount_allocated',
        'amount_pending',
        'amount_committed',
        'amount_used',
    ];

    protected $casts = [
        'amount_allocated' => 'decimal:2',
        'amount_pending' => 'decimal:2',
        'amount_committed' => 'decimal:2',
        'amount_used' => 'decimal:2',
    ];

    public function costCenter()
    {
        return $this->belongsTo(CostCenter::class);
    }

    public function glAccount()
    {
        return $this->belongsTo(GLAccount::class);
    }

    /**
     * Get the remaining budget amount.
     */
    public function getAmountRemainingAttribute()
    {
        return $this->amount_allocated - ($this->amount_pending + $this->amount_committed + $this->amount_used);
    }
}
