<?php

namespace App\Http\Controllers;

use App\Models\ProcurementType;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProcurementTypeController extends Controller
{
    public function index()
    {
        return Inertia::render('Settings/ProcurementTypes/Index', [
            'types' => ProcurementType::all()
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|unique:procurement_types,code',
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'require_pr' => 'boolean',
            'require_rfq' => 'boolean',
            'require_grn' => 'boolean',
            'track_inventory' => 'boolean',
            'is_service' => 'boolean',
            'is_asset' => 'boolean',
            'is_active' => 'boolean',
        ]);

        ProcurementType::create($validated);

        return redirect()->back()->with('success', 'Procurement type created successfully.');
    }

    public function update(Request $request, ProcurementType $procurementType)
    {
        $validated = $request->validate([
            'code' => 'required|unique:procurement_types,code,' . $procurementType->id,
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'require_pr' => 'boolean',
            'require_rfq' => 'boolean',
            'require_grn' => 'boolean',
            'track_inventory' => 'boolean',
            'is_service' => 'boolean',
            'is_asset' => 'boolean',
            'is_active' => 'boolean',
        ]);

        $procurementType->update($validated);

        return redirect()->back()->with('success', 'Procurement type updated successfully.');
    }

    public function destroy(ProcurementType $procurementType)
    {
        $procurementType->delete();

        return redirect()->back()->with('success', 'Procurement type deleted successfully.');
    }
}
