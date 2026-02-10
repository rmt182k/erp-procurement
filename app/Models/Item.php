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
    ];

    public function category()
    {
        return $this->belongsTo(ItemCategory::class, 'category_id');
    }

    public function unit()
    {
        return $this->belongsTo(ItemUnit::class, 'unit_id');
    }
}
