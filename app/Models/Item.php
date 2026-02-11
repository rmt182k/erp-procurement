<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Item extends Model
{
    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'category_id',
        'unit_id',
        'code',
        'name',
        'price',
        'stock',
        'description',
        'status',
        'inventory_account_id',
        'expense_account_id',
    ];

    public function category()
    {
        return $this->belongsTo(ItemCategory::class, 'category_id');
    }

    public function unit()
    {
        return $this->belongsTo(ItemUnit::class, 'unit_id');
    }

    public function inventoryAccount()
    {
        return $this->belongsTo(GLAccount::class, 'inventory_account_id');
    }

    public function expenseAccount()
    {
        return $this->belongsTo(GLAccount::class, 'expense_account_id');
    }
}
