<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ItemCategory extends Model
{
    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'name',
        'description',
        'is_service',
    ];

    protected $casts = [
        'is_service' => 'boolean',
    ];

    public function items()
    {
        return $this->hasMany(Item::class, 'category_id');
    }
}
