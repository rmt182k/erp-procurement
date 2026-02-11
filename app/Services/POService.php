<?php

namespace App\Services;

use App\Models\PurchaseOrder;
use App\Models\PurchaseOrderItem;
use App\Models\PurchaseRequisition;
use App\Models\Currency;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Exception;

class POService
{
    protected $budgetService;
    protected $currencyService;

    public function __construct(BudgetService $budgetService, CurrencyService $currencyService)
    {
        $this->budgetService = $budgetService;
        $this->currencyService = $currencyService;
    }

    /**
     * Create a PO from an approved PR.
     */
    public function createFromPR(PurchaseRequisition $pr)
    {
        if ($pr->status !== 'APPROVED') {
            throw new Exception("Only approved Purchase Requisitions can be converted to Purchase Orders.");
        }

        return DB::transaction(function () use ($pr) {
            // 1. Snapshot current exchange rate
            $currencyCode = $pr->vendor->currency_code ?? 'IDR';
            $rate = $this->currencyService->getRate($currencyCode);

            // 2. Create PO Header
            $po = PurchaseOrder::create([
                'doc_number' => $this->generateDocNumber($pr),
                'procurement_type_id' => $pr->procurement_type_id,
                'vendor_id' => $pr->vendor_id,
                'cost_center_id' => $pr->cost_center_id,
                'status' => 'DRAFT',
                'order_date' => now(),
                'currency_code' => $currencyCode,
                'exchange_rate' => $rate,
                'subtotal' => 0,
                'tax_amount' => 0,
                'grand_total' => 0,
                'created_by' => Auth::id() ?? 1, // Fallback for seeds
            ]);

            // 3. Create PO Items from PR Items
            foreach ($pr->items as $item) {
                $tax_rate = 11.0; // Default PPN
                $unit_price = $item->estimated_unit_price; // Initial nego price same as estimate
                $total_price = $item->quantity * $unit_price * (1 + ($tax_rate / 100));

                PurchaseOrderItem::create([
                    'purchase_order_id' => $po->id,
                    'pr_item_id' => $item->id,
                    'item_id' => $item->item_id,
                    'quantity' => $item->quantity,
                    'unit_price' => $unit_price,
                    'tax_rate' => $tax_rate,
                    'total_price' => $total_price,
                ]);
            }

            // 4. Recalculate Totals
            $this->calculateTotals($po);

            return $po;
        });
    }

    /**
     * Recalculate Subtotal, Tax, and Grand Total for a PO.
     */
    public function calculateTotals(PurchaseOrder $po)
    {
        $po->load('items');

        $subtotal = 0;
        $tax_amount = 0;

        foreach ($po->items as $item) {
            $line_subtotal = $item->quantity * $item->unit_price;
            $line_tax = $line_subtotal * ($item->tax_rate / 100);

            $subtotal += $line_subtotal;
            $tax_amount += $line_tax;

            // Sync item total_price
            $item->update(['total_price' => $line_subtotal + $line_tax]);
        }

        $po->update([
            'subtotal' => $subtotal,
            'tax_amount' => $tax_amount,
            'grand_total' => $subtotal + $tax_amount - $po->discount_amount,
        ]);
    }

    /**
     * Approve PO and execute Budget Swap.
     */
    public function approve(PurchaseOrder $po)
    {
        return DB::transaction(function () use ($po) {
            // 1. Release PR Budget (Pending) if linked
            // We need to find the PR linked to these items
            $prItems = $po->items->whereNotNull('pr_item_id')->pluck('prItem.purchaseRequisition')->unique();

            foreach ($prItems as $pr) {
                if ($pr) {
                    $this->budgetService->release($pr);
                }
            }

            // 2. Commit PO Budget (Committed)
            $this->budgetService->commit($po);

            // 3. Update Status
            $po->update([
                'status' => 'APPROVED',
                'approved_by' => Auth::id(),
            ]);

            return $po;
        });
    }

    protected function generateDocNumber(PurchaseRequisition $pr)
    {
        $year = now()->year;
        $vendorCode = substr($pr->vendor->name, 0, 3);
        $count = PurchaseOrder::whereYear('created_at', $year)->count() + 1;

        return sprintf("PO/%d/%s/%03d", $year, strtoupper($vendorCode), $count);
    }
}
