<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Currency extends Model
{
    use SoftDeletes;

    protected $primaryKey = 'code';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'code',
        'name',
        'symbol',
        'is_base',
    ];

    protected $casts = [
        'is_base' => 'boolean',
    ];

    public function exchangeRates(): HasMany
    {
        return $this->hasMany(ExchangeRate::class, 'currency_code', 'code');
    }

    /**
     * Get the latest valid exchange rate for this currency.
     */
    public function latestRate()
    {
        return $this->exchangeRates()
            ->where('valid_from', '<=', now())
            ->orderBy('valid_from', 'desc')
            ->first();
    }
}
