<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Role;
use App\Models\Permission;

class RBACSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function up(): void
    {
        // 1. Create Permissions
        $permissions = [
            'vendor.manage',
            'item.manage',
            'coa.manage',
            'budget.manage',
            'po.create',
            'po.approve',
            'pr.create',
            'pr.approve',
            'settings.manage',
        ];

        foreach ($permissions as $p) {
            Permission::firstOrCreate(['name' => $p]);
        }

        // 2. Create Roles
        $roles = [
            ['name' => 'admin', 'label' => 'System Administrator'],
            ['name' => 'manager', 'label' => 'Manager'],
            ['name' => 'supervisor', 'label' => 'Supervisor'],
            ['name' => 'staff', 'label' => 'Staff'],
        ];

        foreach ($roles as $r) {
            $role = Role::firstOrCreate(['name' => $r['name']], ['label' => $r['label']]);

            // Assign permissions based on role
            if ($r['name'] === 'admin') {
                $role->permissions()->sync(Permission::all());
            } elseif ($r['name'] === 'manager') {
                $role->permissions()->sync(Permission::whereIn('name', [
                    'vendor.manage',
                    'item.manage',
                    'coa.manage',
                    'budget.manage',
                    'po.approve',
                    'pr.approve'
                ])->get());
            } elseif ($r['name'] === 'supervisor') {
                $role->permissions()->sync(Permission::whereIn('name', [
                    'po.approve',
                    'pr.approve'
                ])->get());
            } elseif ($r['name'] === 'staff') {
                $role->permissions()->sync(Permission::whereIn('name', [
                    'po.create',
                    'pr.create'
                ])->get());
            }
        }
    }

    /**
     * Run the database seeds. (Standard Laravel method)
     */
    public function run(): void
    {
        $this->up();
    }
}
