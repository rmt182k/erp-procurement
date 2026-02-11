<?php

namespace App\Http\Controllers;

use App\Models\ApprovalRule;
use App\Models\Role;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ApprovalRuleController extends Controller
{
    public function index()
    {
        return Inertia::render('ApprovalRules/Index', [
            'rules' => ApprovalRule::with('steps')->get(),
            'roles' => Role::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'doc_type' => 'required|string',
            'min_amount' => 'required|numeric|min:0',
            'max_amount' => 'required|numeric|gte:min_amount',
            'priority' => 'integer',
            'steps' => 'required|array|min:1',
            'steps.*.step_order' => 'required|integer',
            'steps.*.role_name' => 'required|string|exists:roles,name',
        ]);

        DB::transaction(function () use ($validated) {
            $rule = ApprovalRule::create([
                'doc_type' => $validated['doc_type'],
                'min_amount' => $validated['min_amount'],
                'max_amount' => $validated['max_amount'],
                'priority' => $validated['priority'] ?? 0,
            ]);

            foreach ($validated['steps'] as $step) {
                $rule->steps()->create($step);
            }
        });

        return back()->with('success', 'Approval rule created successfully.');
    }

    public function update(Request $request, ApprovalRule $approvalRule)
    {
        $validated = $request->validate([
            'doc_type' => 'required|string',
            'min_amount' => 'required|numeric|min:0',
            'max_amount' => 'required|numeric|gte:min_amount',
            'priority' => 'integer',
            'steps' => 'required|array|min:1',
            'steps.*.step_order' => 'required|integer',
            'steps.*.role_name' => 'required|string|exists:roles,name',
        ]);

        DB::transaction(function () use ($validated, $approvalRule) {
            $approvalRule->update([
                'doc_type' => $validated['doc_type'],
                'min_amount' => $validated['min_amount'],
                'max_amount' => $validated['max_amount'],
                'priority' => $validated['priority'] ?? 0,
            ]);

            $approvalRule->steps()->delete();
            foreach ($validated['steps'] as $step) {
                $approvalRule->steps()->create($step);
            }
        });

        return back()->with('success', 'Approval rule updated successfully.');
    }

    public function destroy(ApprovalRule $approvalRule)
    {
        $approvalRule->delete();
        return back()->with('success', 'Approval rule deleted successfully.');
    }
}
