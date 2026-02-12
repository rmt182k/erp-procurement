<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            DocumentTemplateSeeder::class,
            CurrencySeeder::class,
            RBACSeeder::class,
            ProcurementTypeSeeder::class,
            GLAccountSeeder::class,
            MasterDataSeeder::class,
            ItemModuleSeeder::class,
            PurchaseRequisitionSeeder::class,
        ]);
    }
}
