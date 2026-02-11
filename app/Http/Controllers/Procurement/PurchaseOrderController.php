<?php

namespace App\Http\Controllers\Procurement;

use App\Http\Controllers\Controller;
use App\Models\PurchaseOrder;
use App\Models\PurchaseRequisition;
use App\Models\Vendor;
use App\Models\ProcurementType;
use App\Models\CostCenter;
use App\Services\POService;
use App\Services\PdfService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PurchaseOrderController extends Controller
{
    protected $poService;
    protected $pdfService;

    public function __construct(POService $poService, PdfService $pdfService)
    {
        $this->poService = $poService;
        $this->pdfService = $pdfService;
    }

    public function index()
    {
        return Inertia::render('Procurement/PurchaseOrders/Index', [
            'purchaseOrders' => PurchaseOrder::with(['vendor', 'procurementType', 'costCenter', 'creator'])
                ->orderBy('created_at', 'desc')
                ->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('Procurement/PurchaseOrders/Form', [
            'vendors' => Vendor::all(),
            'procurementTypes' => ProcurementType::all(),
            'costCenters' => CostCenter::all(),
        ]);
    }

    public function store(Request $request)
    {
        // Logic for manual PO creation
        // For MVP, we emphasize PR -> PO conversion, but manual is here.
    }

    /**
     * Convert an approved PR to PO.
     */
    public function convertFromPR(PurchaseRequisition $pr)
    {
        try {
            $po = $this->poService->createFromPR($pr);
            return redirect()->route('purchase-orders.edit', $po->id)
                ->with('success', 'PR converted to PO Draft successfully.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    public function show(PurchaseOrder $purchaseOrder)
    {
        return Inertia::render('Procurement/PurchaseOrders/Show', [
            'po' => $purchaseOrder->load(['items.item', 'items.prItem.purchaseRequisition', 'vendor', 'costCenter', 'currency', 'creator', 'approver']),
        ]);
    }

    public function edit(PurchaseOrder $purchaseOrder)
    {
        return Inertia::render('Procurement/PurchaseOrders/Form', [
            'po' => $purchaseOrder->load('items.item'),
            'vendors' => Vendor::all(),
            'procurementTypes' => ProcurementType::all(),
            'costCenters' => CostCenter::all(),
        ]);
    }

    public function update(Request $request, PurchaseOrder $purchaseOrder)
    {
        // Handle update of negotiated prices, dates, etc.
        $this->poService->calculateTotals($purchaseOrder);
        return redirect()->route('purchase-orders.show', $purchaseOrder->id)
            ->with('success', 'Purchase Order updated.');
    }

    /**
     * Approve and execute Budget Swap.
     */
    public function approve(PurchaseOrder $purchaseOrder)
    {
        try {
            $this->poService->approve($purchaseOrder);
            return redirect()->back()->with('success', 'Purchase Order approved. Budget has been committed.');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }

    /**
     * Print PDF with branding.
     */
    public function print(PurchaseOrder $purchaseOrder)
    {
        $pdf = $this->pdfService->loadView('PO', 'pdf.po.modern', ['po' => $purchaseOrder->load(['items.item', 'vendor', 'costCenter', 'currency', 'creator', 'approver'])]);
        return $pdf->stream("PO-{$purchaseOrder->doc_number}.pdf");
    }
}
