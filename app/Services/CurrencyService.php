<?php

namespace App\Services;

use App\Models\Currency;
use App\Models\ExchangeRate;
use Carbon\Carbon;
use Exception;

class CurrencyService
{
    /**
     * Get the applicable exchange rate for a currency on a specific date.
     * Default date is today.
     * 
     * @param string $currencyCode
     * @param string|Carbon|null $date
     * @return float
     * @throws Exception
     */
    public function getRate(string $currencyCode, $date = null): float
    {
        $date = $date ? Carbon::parse($date) : Carbon::now();

        // 1. If Base Currency (IDR), rate is always 1.0
        // We check if it's the base currency from the database
        $currency = Currency::where('code', $currencyCode)->first();

        if (!$currency) {
            throw new Exception("Currency {$currencyCode} not found in system.");
        }

        if ($currency->is_base) {
            return 1.0;
        }

        // 2. Find the latest valid rate on or before the transaction date
        $rate = ExchangeRate::where('currency_code', $currencyCode)
            ->where('valid_from', '<=', $date->toDateString())
            ->orderBy('valid_from', 'desc')
            ->orderBy('created_at', 'desc')
            ->first();

        if (!$rate) {
            throw new Exception("No exchange rate found for {$currencyCode} on or before " . $date->toDateString());
        }

        return (float) $rate->rate;
    }

    /**
     * Convert an amount from a foreign currency to the base currency (IDR).
     * 
     * @param float $amount
     * @param string $currencyCode
     * @param float|null $manualRate
     * @param string|Carbon|null $date
     * @return float
     */
    public function convertToBase(float $amount, string $currencyCode, ?float $manualRate = null, $date = null): float
    {
        $rate = $manualRate ?? $this->getRate($currencyCode, $date);

        return $amount * $rate;
    }

    /**
     * Convert an amount from the base currency (IDR) to a foreign currency.
     * 
     * @param float $amountIdr
     * @param string $currencyCode
     * @param float|null $manualRate
     * @param string|Carbon|null $date
     * @return float
     */
    public function convertFromBase(float $amountIdr, string $currencyCode, ?float $manualRate = null, $date = null): float
    {
        $rate = $manualRate ?? $this->getRate($currencyCode, $date);

        if ($rate == 0) return 0;

        return $amountIdr / $rate;
    }
}
