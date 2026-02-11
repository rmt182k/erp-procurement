<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class GLAccount extends Model
{
    protected $table = 'gl_accounts';

    protected $fillable = [
        'code',
        'name',
        'type',
    ];

    public function vendors()
    {
        return $this->hasMany(Vendor::class, 'payable_account_id');
    }
}
