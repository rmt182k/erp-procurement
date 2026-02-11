<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VendorPaymentTerm extends Model
{
    protected $fillable = ['name', 'days'];
}
