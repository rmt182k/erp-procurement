<?php

namespace Tests\Feature;

use App\Models\PurchaseRequisition;
use App\Models\PurchaseRequisitionItem;
use App\Models\User;
use App\Models\DocumentTemplate;
use App\Models\ProcurementType;
use App\Models\CostCenter;
use App\Models\Item;
use App\Models\ItemUnit;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PurchaseRequisitionPrintTest extends TestCase
{
    use RefreshDatabase;

    public function test_purchase_requisition_print_route_works()
    {
        $user = User::factory()->create();

        // 1. Setup Document Template
        DocumentTemplate::create([
            'document_type' => 'PR',
            'template_mode' => 'Blade',
            'view_name' => 'modern',
            'margin_top' => 10,
            'margin_bottom' => 10,
            'margin_left' => 10,
            'margin_right' => 10,
        ]);

        // 2. Setup Dependencies
        $procType = ProcurementType::create([
            'code' => 'TEST',
            'name' => 'Test Procurement',
            'is_active' => true
        ]);

        $costCenter = CostCenter::create([
            'code' => 'CC-TEST',
            'name' => 'Test Cost Center',
            'is_active' => true
        ]);

        $unit = ItemUnit::create([
            'name' => 'Each',
            'abbreviation' => 'EA'
        ]);

        $item = Item::create([
            'unit_id' => $unit->id,
            'code' => 'ITEM-001',
            'name' => 'Test Item',
            'price' => 100,
            'status' => 'active'
        ]);

        // 3. Create PR
        $pr = PurchaseRequisition::create([
            'doc_number' => 'PR/2026/001',
            'procurement_type_id' => $procType->id,
            'requester_id' => $user->id,
            'cost_center_id' => $costCenter->id,
            'required_date' => now()->addDays(7),
            'description' => 'Test PR Description',
            'total_estimated_amount' => 100,
            'status' => 'DRAFT',
        ]);

        // 4. Create PR Item
        PurchaseRequisitionItem::create([
            'purchase_requisition_id' => $pr->id,
            'item_id' => $item->id,
            'quantity' => 1,
            'estimated_unit_price' => 100,
            'subtotal' => 100,
        ]);

        $response = $this->actingAs($user)
            ->get(route('purchase-requisitions.print', $pr));

        $response->assertStatus(200);
        $response->assertHeader('Content-Type', 'application/pdf');
    }
}
