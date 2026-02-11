<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class GLAccountSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $accounts = [
            ['code' => '2101', 'name' => 'Account Payable - Trade', 'type' => 'payable'],
            ['code' => '2102', 'name' => 'Account Payable - Other', 'type' => 'payable'],
            ['code' => '6101', 'name' => 'Purchasing Expense', 'type' => 'expense'],
            ['code' => '6102', 'name' => 'Freight Expense', 'type' => 'expense'],
        ];

        foreach ($accounts as $account) {
            \App\Models\GLAccount::updateOrCreate(['code' => $account['code']], $account);
        }
    }
}
