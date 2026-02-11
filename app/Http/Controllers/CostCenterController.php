<?php

namespace App\Http\Controllers;

use App\Models\CostCenter;
use Illuminate\Http\Request;
use Inertia\Inertia;

class CostCenterController extends Controller
{
    public function index()
    {
        return Inertia::render('CostCenters/Index', [
            'cost_centers' => CostCenter::latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:cost_centers,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        CostCenter::create($validated);

        return back()->with('success', 'Cost Center "' . $validated['name'] . '" created successfully.');
    }

    public function update(Request $request, CostCenter $costCenter)
    {
        $validated = $request->validate([
            'code' => 'required|string|unique:cost_centers,code,' . $costCenter->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $costCenter->update($validated);

        return back()->with('success', 'Cost Center "' . $costCenter->name . '" updated successfully.');
    }

    public function destroy(CostCenter $costCenter)
    {
        if ($costCenter->budgets()->exists()) {
            return back()->with('error', 'Cost Center cannot be deleted because it has budget allocations.');
        }

        $costCenter->delete();

        return back()->with('success', 'Cost Center deleted successfully.');
    }
}
