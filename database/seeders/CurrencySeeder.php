<?php

namespace Database\Seeders;

use App\Models\Currency;
use App\Models\ExchangeRate;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class CurrencySeeder extends Seeder
{
    public function run(): void
    {
        $admin = User::first();
        $now = Carbon::now();

        // 1. Base Currency (IDR)
        Currency::create([
            'code' => 'IDR',
            'name' => 'Indonesian Rupiah',
            'symbol' => 'Rp',
            'is_base' => true,
        ]);

        // 2. Foreign Currency (USD)
        Currency::create([
            'code' => 'USD',
            'name' => 'US Dollar',
            'symbol' => '$',
            'is_base' => false,
        ]);

        // 3. Initial Exchange Rates
        // USD Rate: Feb 1st = 15.000
        ExchangeRate::create([
            'currency_code' => 'USD',
            'rate' => 15000,
            'valid_from' => $now->copy()->startOfMonth(), // e.g., 2026-02-01
            'created_by' => $admin->id,
        ]);

        // USD Rate: Feb 10th (if current date is > 10th) = 16.200
        if ($now->day >= 10) {
            ExchangeRate::create([
                'currency_code' => 'USD',
                'rate' => 16200,
                'valid_from' => $now->copy()->day(10),
                'created_by' => $admin->id,
            ]);
        }
    }
}
