<?php

namespace App\Http\Controllers;

use App\Models\PurchaseRequisition;
use App\Models\ProcurementType;
use App\Models\CostCenter;
use App\Models\Item;
use App\Models\Vendor;
use App\Services\BudgetService;
use App\Services\ApprovalService;
use App\Services\PRNumberingService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Exception;

class PurchaseRequisitionController extends Controller
{
    protected $budgetService;
    protected $approvalService;
    protected $numberingService;

    public function __construct(
        BudgetService $budgetService,
        ApprovalService $approvalService,
        PRNumberingService $numberingService
    ) {
        $this->budgetService = $budgetService;
        $this->approvalService = $approvalService;
        $this->numberingService = $numberingService;
    }

    public function index()
    {
        return Inertia::render('Procurement/PurchaseRequisitions/Index', [
            'requisitions' => PurchaseRequisition::with(['requester', 'procurementType', 'costCenter'])->get()
        ]);
    }

    public function create()
    {
        return Inertia::render('Procurement/PurchaseRequisitions/Form', [
            'procurementTypes' => ProcurementType::where('is_active', true)->get(),
            'costCenters' => CostCenter::where('is_active', true)->get(),
            'items' => Item::with('unit')->get(),
            'vendors' => Vendor::all(),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'procurement_type_id' => 'required|exists:procurement_types,id',
            'cost_center_id' => 'required|exists:cost_centers,id',
            'org_node_id' => 'nullable|exists:org_nodes,id',
            'suggested_vendor_id' => 'nullable|exists:vendors,id',
            'required_date' => 'required|date|after_or_equal:today',
            'description' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.item_id' => 'required|exists:items,id',
            'items.*.quantity' => 'required|integer|min:1',
            'items.*.estimated_unit_price' => 'required|numeric|min:0',
        ]);

        return DB::transaction(function () use ($validated, $request) {
            $pr = PurchaseRequisition::create([
                'doc_number' => $this->numberingService->generate(),
                'procurement_type_id' => $validated['procurement_type_id'],
                'requester_id' => auth()->id(),
                'cost_center_id' => $validated['cost_center_id'],
                'org_node_id' => $validated['org_node_id'],
                'suggested_vendor_id' => $validated['suggested_vendor_id'],
                'required_date' => $validated['required_date'],
                'description' => $validated['description'],
                'status' => PurchaseRequisition::STATUS_DRAFT,
            ]);

            $total = 0;
            foreach ($validated['items'] as $itemData) {
                $subtotal = $itemData['quantity'] * $itemData['estimated_unit_price'];
                $pr->items()->create(array_merge($itemData, ['subtotal' => $subtotal]));
                $total += $subtotal;
            }

            $pr->update(['total_estimated_amount' => $total]);

            return redirect()->route('purchase-requisitions.index')->with('success', 'PR Draft created successfully.');
        });
    }

    public function submit(PurchaseRequisition $purchaseRequisition)
    {
        if ($purchaseRequisition->status !== PurchaseRequisition::STATUS_DRAFT) {
            return back()->with('error', 'Only draft PR can be submitted.');
        }

        try {
            DB::transaction(function () use ($purchaseRequisition) {
                // 1. Budget Check & Lock
                $this->budgetService->check($purchaseRequisition);
                $this->budgetService->lock($purchaseRequisition);

                // 2. Init Approval
                $this->approvalService->initApproval($purchaseRequisition, $purchaseRequisition->total_estimated_amount);

                // 3. Update Status
                $purchaseRequisition->update(['status' => PurchaseRequisition::STATUS_SUBMITTED]);
            });

            return back()->with('success', 'PR submitted for approval.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function cancel(Request $request, PurchaseRequisition $purchaseRequisition)
    {
        if ($purchaseRequisition->status !== PurchaseRequisition::STATUS_SUBMITTED) {
            return back()->with('error', 'Only submitted PR waiting for approval can be cancelled.');
        }

        $validated = $request->validate(['cancel_reason' => 'required|string']);

        try {
            DB::transaction(function () use ($purchaseRequisition, $validated) {
                // 1. Release Budget
                $this->budgetService->release($purchaseRequisition);

                // 2. Update Status
                $purchaseRequisition->update([
                    'status' => PurchaseRequisition::STATUS_CANCELLED,
                    'cancel_reason' => $validated['cancel_reason']
                ]);

                // 3. Optional: Cancel approval records?
                $purchaseRequisition->approvals()->update(['status' => 'CANCELLED']);
            });

            return back()->with('success', 'PR cancelled and budget released.');
        } catch (Exception $e) {
            return back()->with('error', $e->getMessage());
        }
    }

    public function show(PurchaseRequisition $purchaseRequisition)
    {
        $purchaseRequisition->load(['items.item.unit', 'requester', 'procurementType', 'costCenter', 'approvals']);
        return Inertia::render('Procurement/PurchaseRequisitions/Show', [
            'requisition' => $purchaseRequisition
        ]);
    }
}
