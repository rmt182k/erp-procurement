<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\PurchaseRequisition;
use App\Models\PurchaseRequisitionItem;
use App\Models\User;
use App\Models\ProcurementType;
use App\Models\CostCenter;
use App\Models\Item;
use App\Services\PRNumberingService;
use Carbon\Carbon;

class PurchaseRequisitionSeeder extends Seeder
{
    public function run(): void
    {
        $numberingService = new PRNumberingService();
        $user = User::where('email', 'roymartogit@gmail.com')->first();
        $procurementTypes = ProcurementType::all();
        $costCenters = CostCenter::all();
        $items = Item::with('category')->get();

        if (!$user || $procurementTypes->isEmpty() || $costCenters->isEmpty() || $items->isEmpty()) {
            return;
        }

        $statuses = [
            PurchaseRequisition::STATUS_DRAFT,
            PurchaseRequisition::STATUS_SUBMITTED,
            PurchaseRequisition::STATUS_APPROVED,
        ];

        for ($i = 1; $i <= 10; $i++) {
            $procType = $procurementTypes->random();
            $costCenter = $costCenters->random();
            $status = $statuses[array_rand($statuses)];

            $pr = PurchaseRequisition::create([
                'doc_number' => $numberingService->generate(),
                'requester_id' => $user->id,
                'procurement_type_id' => $procType->id,
                'cost_center_id' => $costCenter->id,
                'required_date' => Carbon::now()->addDays(rand(7, 30)),
                'description' => "Dummy Purchase Requisition #{$i} for testing purposes.",
                'status' => $status,
                'total_estimated_amount' => 0, // Will be updated
            ]);

            // Filter items that match procurement type service flag
            $compatibleItems = $items->filter(function ($item) use ($procType) {
                return $item->category->is_service == $procType->is_service;
            });

            if ($compatibleItems->isEmpty()) {
                $compatibleItems = $items;
            }

            $numItems = rand(1, 5);
            $totalAmount = 0;

            for ($j = 0; $j < $numItems; $j++) {
                $item = $compatibleItems->random();
                $qty = rand(1, 10);
                $price = $item->price;
                $subtotal = $qty * $price;

                PurchaseRequisitionItem::create([
                    'purchase_requisition_id' => $pr->id,
                    'item_id' => $item->id,
                    'quantity' => $qty,
                    'estimated_unit_price' => $price,
                    'subtotal' => $subtotal,
                ]);

                $totalAmount += $subtotal;
            }

            $pr->update(['total_estimated_amount' => $totalAmount]);
        }
    }
}
