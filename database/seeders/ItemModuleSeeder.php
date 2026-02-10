<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ItemModuleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categoryModels = [];
        $categories = [
            ['name' => 'Elektronik', 'description' => 'Perangkat elektronik dan aksesoris'],
            ['name' => 'Furnitur', 'description' => 'Mebel kantor dan rumah tangga'],
            ['name' => 'Alat Tulis', 'description' => 'Perlengkapan alat tulis kantor'],
            ['name' => 'Otomotif', 'description' => 'Suku cadang dan perlengkapan otomotif'],
        ];

        foreach ($categories as $category) {
            $categoryModels[] = \App\Models\ItemCategory::firstOrCreate(['name' => $category['name']], $category);
        }

        $unitModels = [];
        $units = [
            ['name' => 'Piece', 'abbreviation' => 'Pcs'],
            ['name' => 'Box', 'abbreviation' => 'Box'],
            ['name' => 'Kilogram', 'abbreviation' => 'Kg'],
            ['name' => 'Meter', 'abbreviation' => 'M'],
        ];

        foreach ($units as $unit) {
            $unitModels[] = \App\Models\ItemUnit::firstOrCreate(['abbreviation' => $unit['abbreviation']], $unit);
        }

        // Seed 100 items
        for ($i = 1; $i <= 100; $i++) {
            $cat = $categoryModels[array_rand($categoryModels)];
            $unit = $unitModels[array_rand($unitModels)];

            \App\Models\Item::create([
                'category_id' => $cat->id,
                'unit_id' => $unit->id,
                'code' => 'BRG-' . str_pad($i, 4, '0', STR_PAD_LEFT),
                'name' => $cat->name . ' Product ' . $i,
                'price' => rand(10, 1000) * 1000,
                'stock' => rand(1, 100),
                'description' => 'Deskripsi contoh untuk produk nomor ' . $i,
                'status' => rand(0, 10) > 1 ? 'active' : 'inactive',
            ]);
        }
    }
}
