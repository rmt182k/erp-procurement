<?php

namespace App\Http\Controllers;

use App\Models\GLAccount;
use Illuminate\Http\Request;
use Inertia\Inertia;

class GLAccountController extends Controller
{
    public function index()
    {
        return Inertia::render('COA/Index', [
            'accounts' => GLAccount::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:gl_accounts,code',
            'name' => 'required|string|max:255',
            'type' => 'required|in:asset,liability,equity,revenue,expense',
        ]);

        GLAccount::create($validated);

        return back()->with('success', 'Account "' . $validated['name'] . '" created successfully.');
    }

    public function update(Request $request, GLAccount $account)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:gl_accounts,code,' . $account->id,
            'name' => 'required|string|max:255',
            'type' => 'required|in:asset,liability,equity,revenue,expense',
        ]);

        $account->update($validated);

        return back()->with('success', 'Account "' . $account->name . '" updated successfully.');
    }

    public function destroy(GLAccount $account)
    {
        // Check if used in Vendors or Items
        if (
            $account->vendors()->exists() ||
            \App\Models\Item::where('inventory_account_id', $account->id)->orWhere('expense_account_id', $account->id)->exists()
        ) {
            return back()->with('error', 'Account cannot be deleted because it is in use.');
        }

        $account->delete();

        return back()->with('success', 'Account deleted successfully.');
    }
}
