<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ProcurementType;

class ProcurementTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        ProcurementType::create([
            'code' => 'STD-GOODS',
            'name' => 'Standard Inventory Purchase',
            'description' => 'Pembelian stok barang dagang standar',
            'require_pr' => true,
            'require_rfq' => true,
            'require_grn' => true,
            'track_inventory' => true,
            'is_service' => false,
            'is_asset' => false,
        ]);

        ProcurementType::create([
            'code' => 'SERVICE',
            'name' => 'Service Order (Jasa)',
            'description' => 'Pembelian jasa atau layanan non-fisik',
            'require_pr' => true,
            'require_rfq' => false,
            'require_grn' => false,
            'track_inventory' => false,
            'is_service' => true,
            'is_asset' => false,
        ]);

        ProcurementType::create([
            'code' => 'ASSET',
            'name' => 'Fixed Asset Purchase',
            'description' => 'Pembelian aset tetap perusahaan',
            'require_pr' => true,
            'require_rfq' => true,
            'require_grn' => true,
            'track_inventory' => false,
            'is_service' => false,
            'is_asset' => true,
        ]);

        ProcurementType::create([
            'code' => 'DIRECT-PURCHASE',
            'name' => 'Direct Purchase (Fast-Track)',
            'description' => 'Pembelian langsung tanpa PR/RFQ',
            'require_pr' => false,
            'require_rfq' => false,
            'require_grn' => true,
            'track_inventory' => true,
            'is_service' => false,
            'is_asset' => false,
        ]);
    }
}
