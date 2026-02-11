<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\GLAccount;

class GLAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Standard categories: 'asset', 'liability', 'equity', 'revenue', 'expense'

        $accounts = [
            // --- ASSETS (HARTA) ---
            [
                'code' => '1101',
                'name' => 'Merchandise Inventory (Persediaan Barang)',
                'type' => 'asset'
            ],
            [
                'code' => '1102',
                'name' => 'VAT In (PPN Masukan)',
                'type' => 'asset'
            ],

            // --- LIABILITIES (KEWAJIBAN) ---
            [
                'code' => '2101',
                'name' => 'Account Payable - Trade (Hutang Usaha)',
                'type' => 'liability'
            ],
            [
                'code' => '2102',
                'name' => 'Account Payable - Other',
                'type' => 'liability'
            ],

            // --- EXPENSES (BEBAN) ---
            [
                'code' => '5101',
                'name' => 'Cost of Goods Sold (HPP)',
                'type' => 'expense'
            ],
            [
                'code' => '6101',
                'name' => 'General Purchasing Expense',
                'type' => 'expense'
            ],
        ];

        foreach ($accounts as $account) {
            GLAccount::updateOrCreate(['code' => $account['code']], $account);
        }
    }
}
