<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use App\Models\GLAccount;
use App\Models\Currency;
use App\Models\VendorPaymentTerm;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class VendorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Vendors/Index', [
            'vendors' => Vendor::with(['payableAccount', 'currency', 'paymentTerm'])->get(),
            'gl_accounts' => GLAccount::where('type', 'payable')->get(),
            'currencies' => Currency::all(),
            'payment_terms' => VendorPaymentTerm::all(),
            'filters' => request()->all(['search']),
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        // Handled by Modal on Index
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address_line1' => 'required|string',
            'address_line2' => 'nullable|string',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:10',
            'country' => 'required|string|size:2',
            'tax_id' => 'nullable|string|max:50|unique:vendors,tax_id',
            'is_pkp' => 'required|boolean',
            'currency_id' => 'required|exists:currencies,id',
            'payment_term_id' => 'required|exists:vendor_payment_terms,id',
            'bank_name' => 'nullable|string|max:100',
            'bank_account_number' => 'nullable|string|max:50',
            'bank_holder_name' => 'nullable|string|max:255',
            'payable_account_id' => 'nullable|exists:gl_accounts,id',
        ]);

        DB::transaction(function () use ($validated) {
            $lastVendor = Vendor::orderBy('id', 'desc')->first();
            $nextId = $lastVendor ? $lastVendor->id + 1 : 1;
            $validated['code'] = 'VEN-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);

            Vendor::create($validated);
        });

        return back()->with('success', 'Vendor created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Vendor $vendor)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Vendor $vendor)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Vendor $vendor)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:20',
            'address_line1' => 'required|string',
            'address_line2' => 'nullable|string',
            'city' => 'required|string|max:100',
            'postal_code' => 'required|string|max:10',
            'country' => 'required|string|size:2',
            'tax_id' => 'nullable|string|max:50|unique:vendors,tax_id,' . $vendor->id,
            'is_pkp' => 'required|boolean',
            'currency_id' => 'required|exists:currencies,id',
            'payment_term_id' => 'required|exists:vendor_payment_terms,id',
            'bank_name' => 'nullable|string|max:100',
            'bank_account_number' => 'nullable|string|max:50',
            'bank_holder_name' => 'nullable|string|max:255',
            'payable_account_id' => 'nullable|exists:gl_accounts,id',
        ]);

        $vendor->update($validated);

        return back()->with('success', 'Vendor updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Vendor $vendor)
    {
        $vendor->delete();

        return back()->with('success', 'Vendor deleted successfully.');
    }
}
