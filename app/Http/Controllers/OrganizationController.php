<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\OrgNode;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class OrganizationController extends Controller
{
    public function index()
    {
        $users = User::select('id', 'name', 'email')->get();

        // Fetch root nodes with their recursive children
        $nodes = OrgNode::whereNull('parent_id')
            ->orderBy('sort_order')
            ->with('children') // This only gets one level, but we want recursive
            ->get();

        // Helper to get recursive children
        $tree = $this->loadTree($nodes);

        return Inertia::render('Organization/Index', [
            'users' => $users,
            'initialNodes' => $tree
        ]);
    }

    private function loadTree($nodes)
    {
        return $nodes->map(function ($node) {
            return [
                'id' => $node->id,
                'type' => $node->type,
                'label' => $node->label,
                'isExpanded' => $node->is_expanded,
                'meta' => $node->meta,
                'children' => $this->loadTree($node->children)
            ];
        });
    }

    public function update(Request $request)
    {
        $nodes = $request->input('nodes');

        DB::transaction(function () use ($nodes) {
            // Use delete() instead of truncate() to avoid implicit commits and FK issues
            OrgNode::query()->delete();
            $this->saveNodes($nodes);
        });

        return back()->with('success', 'Organization structure saved successfully.');
    }

    private function saveNodes($nodes, $parentId = null)
    {
        foreach ($nodes as $index => $nodeData) {
            $node = OrgNode::create([
                'id' => $nodeData['id'],
                'parent_id' => $parentId,
                'type' => $nodeData['type'],
                'label' => $nodeData['label'] ?? '',
                'is_expanded' => $nodeData['isExpanded'] ?? true,
                'meta' => $nodeData['meta'] ?? null,
                'sort_order' => $index,
            ]);

            if (!empty($nodeData['children'])) {
                $this->saveNodes($nodeData['children'], $node->id);
            }
        }
    }
}
