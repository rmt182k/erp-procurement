<?php

namespace App\Services;

use App\Models\PurchaseRequisition;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class PRNumberingService
{
    /**
     * Generate a unique PR number: PR/YYYY/MM/SEQUENCE
     */
    public function generate()
    {
        return \DB::transaction(function () {
            $now = Carbon::now();
            $prefix = "PR/{$now->year}/" . $now->format('m');

            // Find the last sequence for the current month/year with lock
            $lastPr = PurchaseRequisition::where('doc_number', 'like', "{$prefix}/%")
                ->orderBy('doc_number', 'desc')
                ->lockForUpdate()
                ->first();

            $sequence = 1;
            if ($lastPr) {
                $parts = explode('/', $lastPr->doc_number);
                $lastSequence = (int) end($parts);
                $sequence = $lastSequence + 1;
            }

            return "{$prefix}/" . str_pad($sequence, 4, '0', STR_PAD_LEFT);
        });
    }
}
