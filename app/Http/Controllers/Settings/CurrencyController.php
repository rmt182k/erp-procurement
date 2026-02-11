<?php

namespace App\Http\Controllers\Settings;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CurrencyController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/Currencies/Index', [
            'currencies' => Currency::orderBy('is_base', 'desc')->orderBy('code')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|size:3|unique:currencies,code',
            'name' => 'required|string|max:255',
            'symbol' => 'required|string|max:10',
            'is_base' => 'boolean',
        ]);

        if ($validated['is_base']) {
            Currency::where('is_base', true)->update(['is_base' => false]);
        }

        Currency::create($validated);

        return redirect()->back()->with('success', 'Currency created successfully.');
    }

    public function update(Request $request, Currency $currency)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'symbol' => 'required|string|max:10',
            'is_base' => 'boolean',
        ]);

        if ($validated['is_base'] && !$currency->is_base) {
            Currency::where('is_base', true)->update(['is_base' => false]);
        }

        $currency->update($validated);

        return redirect()->back()->with('success', 'Currency updated successfully.');
    }

    public function destroy(Currency $currency)
    {
        if ($currency->is_base) {
            return redirect()->back()->with('error', 'Cannot delete the base currency.');
        }

        $currency->delete();

        return redirect()->back()->with('success', 'Currency deleted successfully.');
    }
}
