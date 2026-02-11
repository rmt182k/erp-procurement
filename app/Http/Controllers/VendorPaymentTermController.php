<?php

namespace App\Http\Controllers;

use App\Models\VendorPaymentTerm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;

class VendorPaymentTermController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'days' => 'required|integer|min:0',
        ]);

        VendorPaymentTerm::create($validated);

        return Redirect::back()->with('success', 'Payment term created successfully.');
    }

    public function update(Request $request, VendorPaymentTerm $vendorPaymentTerm)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'days' => 'required|integer|min:0',
        ]);

        $vendorPaymentTerm->update($validated);

        return Redirect::back()->with('success', 'Payment term updated successfully.');
    }

    public function destroy(VendorPaymentTerm $vendorPaymentTerm)
    {
        $vendorPaymentTerm->delete();

        return Redirect::back()->with('success', 'Payment term deleted successfully.');
    }
}
