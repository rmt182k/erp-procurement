<?php

namespace App\Traits;

use App\Models\Role;
use App\Models\Permission;

trait HasRBAC
{
    /**
     * Relationship: User has many Roles.
     */
    public function roles()
    {
        return $this->morphToMany(Role::class, 'model', 'model_has_roles');
    }

    /**
     * Check if user has a specific role by name.
     */
    public function hasRole(string|array $role): bool
    {
        if (is_array($role)) {
            return $this->roles->whereIn('name', $role)->isNotEmpty();
        }

        return $this->roles->where('name', $role)->isNotEmpty();
    }

    /**
     * Assign a role to the user.
     */
    public function assignRole(string $roleName)
    {
        $role = Role::where('name', $roleName)->firstOrFail();
        return $this->roles()->syncWithoutDetaching([$role->id]);
    }

    /**
     * Check if user has a specific permission.
     */
    public function hasPermission(string $permissionName): bool
    {
        foreach ($this->roles as $role) {
            if ($role->permissions->where('name', $permissionName)->isNotEmpty()) {
                return true;
            }
        }

        return false;
    }
}
