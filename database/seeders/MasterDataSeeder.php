<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Currency;
use App\Models\VendorPaymentTerm;
use App\Models\OrgNode;
use App\Models\CostCenter;
use App\Models\Budget;
use App\Models\GLAccount;

class MasterDataSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Currencies
        $currencies = [
            ['code' => 'IDR', 'name' => 'Indonesian Rupiah', 'symbol' => 'Rp'],
            ['code' => 'USD', 'name' => 'US Dollar', 'symbol' => '$'],
        ];

        foreach ($currencies as $curr) {
            Currency::firstOrCreate(['code' => $curr['code']], $curr);
        }

        // 2. Vendor Payment Terms
        $terms = [
            ['name' => 'COD', 'days' => 0],
            ['name' => 'Net 30', 'days' => 30],
            ['name' => 'Net 60', 'days' => 60],
        ];

        foreach ($terms as $term) {
            VendorPaymentTerm::firstOrCreate(['name' => $term['name']], $term);
        }

        // 3. Org Nodes
        $nodes = [
            ['code' => 'HO', 'name' => 'Head Office', 'type' => 'office'],
            ['code' => 'WHA', 'name' => 'Warehouse A', 'type' => 'warehouse'],
            ['code' => 'WHB', 'name' => 'Warehouse B', 'type' => 'warehouse'],
        ];

        foreach ($nodes as $node) {
            OrgNode::firstOrCreate(['code' => $node['code']], array_merge($node, [
                'id' => (string) \Illuminate\Support\Str::uuid(),
            ]));
        }

        // 4. Cost Centers
        $costCenters = [
            ['code' => 'CC-OPS', 'name' => 'Operations'],
            ['code' => 'CC-MKT', 'name' => 'Marketing'],
            ['code' => 'CC-IT', 'name' => 'IT Department'],
        ];

        foreach ($costCenters as $cc) {
            CostCenter::firstOrCreate(['code' => $cc['code']], $cc);
        }

        // 5. Budgets (example for fiscal year 2026)
        $itDept = CostCenter::where('code', 'CC-IT')->first();
        $expenseAccount = GLAccount::where('code', '6101')->first(); // General Purchasing Expense

        if ($itDept && $expenseAccount) {
            Budget::firstOrCreate([
                'cost_center_id' => $itDept->id,
                'gl_account_id' => $expenseAccount->id,
                'fiscal_year' => 2026,
            ], [
                'amount_allocated' => 500000000, // 500 million
                'amount_reserved' => 0,
                'amount_used' => 0,
            ]);
        }
    }
}
