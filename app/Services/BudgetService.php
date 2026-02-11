<?php

namespace App\Services;

use App\Models\Budget;
use App\Models\PurchaseOrder;
use App\Models\PurchaseRequisition;
use App\Models\PurchaseRequisitionItem;
use Illuminate\Support\Facades\DB;
use Exception;

class BudgetService
{
    /**
     * Check if budget is sufficient for the PR items.
     */
    public function check(PurchaseRequisition $pr)
    {
        $year = $pr->created_at->year;

        // Group by GL Account since multiple items might hit the same account
        // For now, ITEM has gl accounts, but PR header has Cost Center.
        // We need to verify if we use item's expense account or something else.
        // Standard ERP: PR Item hits (Cost Center + GL Account).

        foreach ($pr->items as $item) {
            $glAccountId = $item->item->expense_account_id;

            $budget = Budget::where('cost_center_id', $pr->cost_center_id)
                ->where('gl_account_id', $glAccountId)
                ->where('fiscal_year', $year)
                ->first();

            if (!$budget) {
                throw new Exception("Budget not found for Cost Center and GL Account in year {$year}.");
            }

            $currentAvailable = $budget->amount_allocated - ($budget->amount_pending + $budget->amount_reserved + $budget->amount_used);

            if ($item->subtotal > $currentAvailable) {
                throw new Exception("Insufficient budget for item {$item->item->name}. Needed: " . number_format($item->subtotal) . ", Available: " . number_format($currentAvailable));
            }
        }

        return true;
    }

    /**
     * Lock budget (Move to amount_pending).
     */
    public function lock(PurchaseRequisition $pr)
    {
        $year = $pr->created_at->year;

        foreach ($pr->items as $item) {
            $glAccountId = $item->item->expense_account_id;

            $budget = Budget::where('cost_center_id', $pr->cost_center_id)
                ->where('gl_account_id', $glAccountId)
                ->where('fiscal_year', $year)
                ->first();

            if ($budget) {
                $budget->increment('amount_pending', $item->subtotal);
            }
        }
    }

    /**
     * Release budget (Decrease amount_pending).
     */
    public function release(PurchaseRequisition $pr)
    {
        $year = $pr->created_at->year;

        foreach ($pr->items as $item) {
            $glAccountId = $item->item->expense_account_id;

            $budget = Budget::where('cost_center_id', $pr->cost_center_id)
                ->where('gl_account_id', $glAccountId)
                ->where('fiscal_year', $year)
                ->first();

            if ($budget && $budget->amount_pending >= $item->subtotal) {
                $budget->decrement('amount_pending', $item->subtotal);
            }
        }
    }

    /**
     * Commit budget (Move from pending to committed).
     */
    public function commit(PurchaseOrder $po)
    {
        $year = $po->order_date->year;

        foreach ($po->items as $item) {
            $glAccountId = $item->item->expense_account_id;

            $budget = Budget::where('cost_center_id', $po->cost_center_id)
                ->where('gl_account_id', $glAccountId)
                ->where('fiscal_year', $year)
                ->first();

            if ($budget) {
                // If this PO item came from a PR item, we should have released the pending amount already or we do it here.
                // In POService::approve, we will call release(PR) then commit(PO).

                // Convert to base currency for budget tracking
                $baseAmount = $item->total_price * $po->exchange_rate;
                $budget->increment('amount_committed', $baseAmount);
            }
        }
    }

    /**
     * Release committed budget (Decrease amount_committed, increase amount_used).
     * Used when Invoice/Payment is made (for future use).
     */
    public function realize(PurchaseOrder $po, $amount)
    {
        // Placeholder for realisasi invoice
    }
}
