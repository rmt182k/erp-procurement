<?php

namespace App\Http\Controllers;

use App\Models\Item;
use App\Models\ItemCategory;
use App\Models\ItemUnit;
use App\Models\GLAccount;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class ItemController extends Controller
{
    public function index(Request $request)
    {
        $query = Item::with(['category', 'unit', 'inventoryAccount', 'expenseAccount']);

        // We return a larger set (up to 1000) for client-side instant search/sort/pagination
        $items = $query->latest()->get();

        return Inertia::render('Items/Index', [
            'items' => $items,
            'categories' => ItemCategory::all(),
            'units' => ItemUnit::all(),
            'gl_accounts' => GLAccount::all(),
            'filters' => $request->only(['search', 'category'])
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:item_categories,id',
            'unit_id' => 'required|exists:item_units,id',
            'code' => 'required|string|unique:items,code',
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'inventory_account_id' => 'required|exists:gl_accounts,id',
            'expense_account_id' => 'required|exists:gl_accounts,id',
        ]);

        Item::create($validated);

        return back()->with('success', 'Barang "' . $validated['name'] . '" berhasil disimpan.');
    }

    public function update(Request $request, Item $item)
    {
        $validated = $request->validate([
            'category_id' => 'required|exists:item_categories,id',
            'unit_id' => 'required|exists:item_units,id',
            'code' => 'required|string|unique:items,code,' . $item->id,
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'status' => 'required|in:active,inactive',
            'inventory_account_id' => 'required|exists:gl_accounts,id',
            'expense_account_id' => 'required|exists:gl_accounts,id',
        ]);

        $item->update($validated);

        return back()->with('success', 'Barang "' . $item->name . '" berhasil diperbarui.');
    }

    public function destroy(Item $item)
    {
        $item->delete();

        return back()->with('success', 'Barang berhasil dihapus.');
    }

    public function categories()
    {
        return response()->json(ItemCategory::all());
    }

    public function storeCategory(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:item_categories,name',
            'description' => 'nullable|string',
        ]);

        $category = ItemCategory::create($validated);

        if ($request->wantsJson()) {
            return response()->json($category);
        }

        return back()->with('success', 'Kategori "' . $category->name . '" berhasil ditambahkan.');
    }

    public function updateCategory(Request $request, ItemCategory $category)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:item_categories,name,' . $category->id,
            'description' => 'nullable|string',
        ]);

        $category->update($validated);

        return back()->with('success', 'Kategori "' . $category->name . '" berhasil diperbarui.');
    }

    public function destroyCategory(ItemCategory $category)
    {
        if ($category->items()->exists()) {
            return back()->with('error', 'Kategori tidak bisa dihapus karena masih digunakan oleh beberapa barang.');
        }

        $category->delete();

        return back()->with('success', 'Kategori berhasil dihapus.');
    }

    public function units()
    {
        return response()->json(ItemUnit::all());
    }

    public function storeUnit(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:item_units,name',
            'abbreviation' => 'required|string|max:10|unique:item_units,abbreviation',
        ]);

        $unit = ItemUnit::create($validated);

        if ($request->wantsJson()) {
            return response()->json($unit);
        }

        return back()->with('success', 'Satuan "' . $unit->name . '" berhasil ditambahkan.');
    }

    public function updateUnit(Request $request, ItemUnit $unit)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:item_units,name,' . $unit->id,
            'abbreviation' => 'required|string|max:10|unique:item_units,abbreviation,' . $unit->id,
        ]);

        $unit->update($validated);

        return back()->with('success', 'Satuan "' . $unit->name . '" berhasil diperbarui.');
    }

    public function destroyUnit(ItemUnit $unit)
    {
        if ($unit->items()->exists()) {
            return back()->with('error', 'Satuan tidak bisa dihapus karena masih digunakan oleh beberapa barang.');
        }

        $unit->delete();

        return back()->with('success', 'Satuan berhasil dihapus.');
    }
}
