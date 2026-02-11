<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    protected $fillable = [
        'code',
        'name',
        'email',
        'phone',
        'address_line1',
        'address_line2',
        'city',
        'postal_code',
        'country',
        'tax_id',
        'is_pkp',
        'currency_code',
        'payment_term_id',
        'bank_name',
        'bank_account_number',
        'bank_holder_name',
        'payable_account_id',
    ];

    protected $casts = [
        'is_pkp' => 'boolean',
    ];

    public function currency()
    {
        return $this->belongsTo(Currency::class, 'currency_code', 'code');
    }

    public function paymentTerm()
    {
        return $this->belongsTo(VendorPaymentTerm::class, 'payment_term_id');
    }

    public function payableAccount()
    {
        return $this->belongsTo(GLAccount::class, 'payable_account_id');
    }
}
