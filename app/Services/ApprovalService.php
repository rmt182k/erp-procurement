<?php

namespace App\Services;

use App\Models\ApprovalRule;
use App\Models\DocumentApproval;
use App\Models\User;
use Illuminate\Support\Facades\DB;
use Exception;

class ApprovalService
{
    /**
     * Initialize approval steps for a document based on its amount.
     */
    public function initApproval($document, float $amount, string $currency = 'IDR')
    {
        return DB::transaction(function () use ($document, $amount, $currency) {
            // 1. Find the matching rule
            $rule = ApprovalRule::where('doc_type', class_basename($document))
                ->where('min_amount', '<=', $amount)
                ->where('max_amount', '>=', $amount)
                ->orderBy('priority', 'desc')
                ->first();

            if (!$rule) {
                // If no rule found, we might want to auto-approve or log it.
                // For now, let's assume every document needs a rule.
                throw new Exception("No approval rule found for " . class_basename($document) . " with amount " . number_format($amount, 2));
            }

            // 2. Clear existing approvals if any (re-submission logic)
            $document->approvals()->delete();

            // 3. Generate steps from rule
            $steps = $rule->steps;
            foreach ($steps as $step) {
                DocumentApproval::create([
                    'document_type' => get_class($document),
                    'document_id' => $document->id,
                    'approval_step_id' => $step->id,
                    'step_order' => $step->step_order,
                    'role_name' => $step->role_name,
                    'status' => $step->step_order === 1 ? 'PENDING' : 'WAITING',
                ]);
            }

            // 4. Trigger notification for the first step
            $this->notifyApprovers($document, 1);

            return $document->approvals;
        });
    }

    /**
     * Process an approval for the current pending step.
     */
    public function approve($document, User $user, ?string $remarks = null)
    {
        return DB::transaction(function () use ($document, $user, $remarks) {
            // 1. Get current pending step
            $currentStep = $document->approvals()
                ->where('status', 'PENDING')
                ->orderBy('step_order')
                ->first();

            if (!$currentStep) {
                throw new Exception("No pending approval step found for this document.");
            }

            // 2. VALIDATION: Check Role
            if (!$user->hasRole($currentStep->role_name)) {
                throw new Exception("Unauthorized. You do not have the required role: " . $currentStep->role_name);
            }

            // 3. VALIDATION: Anti-Fraud (Segregation of Duties)
            if ($document->created_by === $user->id) {
                throw new Exception("Anti-Fraud Trigger: You cannot approve a document you created yourself.");
            }

            // 4. Update current step
            $currentStep->update([
                'status' => 'APPROVED',
                'approver_id' => $user->id,
                'remarks' => $remarks,
                'approved_at' => now(),
            ]);

            // 5. Open next step
            $nextStep = $document->approvals()
                ->where('step_order', $currentStep->step_order + 1)
                ->first();

            if ($nextStep) {
                $nextStep->update(['status' => 'PENDING']);
                $this->notifyApprovers($document, $nextStep->step_order);
            } else {
                // Final Approval reached
                $document->update(['status' => 'APPROVED']);
            }

            return $currentStep;
        });
    }

    /**
     * Reject a document.
     */
    public function reject($document, User $user, string $remarks)
    {
        return DB::transaction(function () use ($document, $user, $remarks) {
            $currentStep = $document->approvals()
                ->where('status', 'PENDING')
                ->orderBy('step_order')
                ->first();

            if (!$currentStep) {
                throw new Exception("No pending approval step found to reject.");
            }

            // Validate Role
            if (!$user->hasRole($currentStep->role_name)) {
                throw new Exception("Unauthorized to reject this step.");
            }

            $currentStep->update([
                'status' => 'REJECTED',
                'approver_id' => $user->id,
                'remarks' => $remarks,
                'approved_at' => now(),
            ]);

            // Mark document as REJECTED and potentially move it back to DRAFT or similar
            $document->update(['status' => 'REJECTED']);

            return $currentStep;
        });
    }

    /**
     * Stub for notification logic.
     */
    protected function notifyApprovers($document, int $stepOrder)
    {
        // To be implemented: Send database/email notification to all users with matching role
        // Log::info("Notification: Document " . $document->id . " waiting for step " . $stepOrder);
    }
}
