<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class OrgNode extends Model
{
    use HasUuids;

    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'id',
        'parent_id',
        'code',
        'name',
        'type',
        'is_expanded',
        'meta',
        'sort_order',
    ];

    protected $casts = [
        'is_expanded' => 'boolean',
        'meta' => 'array',
        'sort_order' => 'integer',
    ];

    public function parent()
    {
        return $this->belongsTo(OrgNode::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(OrgNode::class, 'parent_id')->orderBy('sort_order', 'asc');
    }
}
