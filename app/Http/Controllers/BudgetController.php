<?php

namespace App\Http\Controllers;

use App\Models\Budget;
use App\Models\CostCenter;
use App\Models\GLAccount;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class BudgetController extends Controller
{
    public function index(Request $request)
    {
        $fiscalYear = $request->input('fiscal_year', date('Y'));

        $budgets = Budget::with(['costCenter', 'glAccount'])
            ->where('fiscal_year', $fiscalYear)
            ->get();

        return Inertia::render('Budgets/Index', [
            'budgets' => $budgets,
            'cost_centers' => CostCenter::where('is_active', true)->get(),
            'gl_accounts' => GLAccount::whereIn('type', ['asset', 'expense'])->get(),
            'fiscal_year' => (int)$fiscalYear,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cost_center_id' => 'required|exists:cost_centers,id',
            'fiscal_year' => 'required|integer|min:2000|max:2100',
            'allocations' => 'required|array|min:1',
            'allocations.*.gl_account_id' => 'required|exists:gl_accounts,id',
            'allocations.*.amount' => 'required|numeric|min:0',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['allocations'] as $allocation) {
                Budget::updateOrCreate(
                    [
                        'cost_center_id' => $validated['cost_center_id'],
                        'gl_account_id' => $allocation['gl_account_id'],
                        'fiscal_year' => $validated['fiscal_year'],
                    ],
                    [
                        'amount_allocated' => $allocation['amount'],
                    ]
                );
            }
        });

        return back()->with('success', 'Budget allocations saved successfully.');
    }

    /**
     * API Endpoint to check budget availability.
     */
    public function check(Request $request)
    {
        $request->validate([
            'cost_center_id' => 'required|exists:cost_centers,id',
            'gl_account_id' => 'required|exists:gl_accounts,id',
            'fiscal_year' => 'required|integer',
            'amount_requested' => 'required|numeric|min:0',
        ]);

        $budget = Budget::where('cost_center_id', $request->cost_center_id)
            ->where('gl_account_id', $request->gl_account_id)
            ->where('fiscal_year', $request->fiscal_year)
            ->first();

        if (!$budget) {
            return response()->json([
                'status' => 'no_budget',
                'message' => 'No budget allocated for this account/cost center.',
            ], 422);
        }

        $available = $budget->amount_allocated - ($budget->amount_reserved + $budget->amount_used);

        if ($request->amount_requested > $available) {
            return response()->json([
                'status' => 'over_budget',
                'message' => 'Insufficient budget. Available: ' . number_format($available, 2),
                'available' => $available,
            ], 422);
        }

        return response()->json([
            'status' => 'ok',
            'available' => $available,
        ]);
    }
}
