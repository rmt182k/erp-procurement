<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use App\Models\ExchangeRate;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ExchangeRateController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/ExchangeRates/Index', [
            'currencies' => Currency::where('is_base', false)->get(),
            'exchangeRates' => ExchangeRate::with(['currency', 'creator'])
                ->orderBy('valid_from', 'desc')
                ->orderBy('created_at', 'desc')
                ->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'currency_code' => 'required|string|exists:currencies,code',
            'rate' => 'required|numeric|min:0',
            'valid_from' => 'required|date',
        ]);

        $validated['created_by'] = $request->user()->id;

        ExchangeRate::create($validated);

        return redirect()->back()->with('success', 'Exchange rate recorded successfully.');
    }

    public function destroy(ExchangeRate $exchangeRate)
    {
        $exchangeRate->delete();
        return redirect()->back()->with('success', 'Exchange rate deleted successfully.');
    }
}
