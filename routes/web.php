<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\OrganizationController;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\VendorController;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\VendorPaymentTermController;
use App\Http\Controllers\GLAccountController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::post('/language', function (Illuminate\Http\Request $request) {
    $request->validate(['locale' => 'required|string|in:en,id']);
    session(['locale' => $request->locale]);
    return back();
})->name('language.update');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store']);

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/organization', [OrganizationController::class, 'index'])->name('organization.index');
    Route::put('/organization', [OrganizationController::class, 'update'])->name('organization.update');

    // Item Module Routes
    Route::resource('items', ItemController::class);
    // For now, simple routes for categories and units or wait for user input?
    // I'll add them as well since they are needed for normalized items
    Route::get('item-categories', [ItemController::class, 'categories'])->name('items.categories');
    Route::post('item-categories', [ItemController::class, 'storeCategory'])->name('items.categories.store');
    Route::put('item-categories/{category}', [ItemController::class, 'updateCategory'])->name('items.categories.update');
    Route::delete('item-categories/{category}', [ItemController::class, 'destroyCategory'])->name('items.categories.destroy');

    Route::get('item-units', [ItemController::class, 'units'])->name('items.units');
    Route::post('item-units', [ItemController::class, 'storeUnit'])->name('items.units.store');
    Route::put('item-units/{unit}', [ItemController::class, 'updateUnit'])->name('items.units.update');
    Route::delete('item-units/{unit}', [ItemController::class, 'destroyUnit'])->name('items.units.destroy');

    // Vendor Management Routes
    Route::resource('vendors', VendorController::class);
    Route::resource('currencies', CurrencyController::class)->only(['store', 'update', 'destroy']);
    Route::resource('vendor-payment-terms', VendorPaymentTermController::class)->only(['store', 'update', 'destroy']);
    Route::resource('chart-of-accounts', GLAccountController::class);

    // Budgeting & Cost Control Routes
    Route::resource('cost-centers', \App\Http\Controllers\CostCenterController::class);
    Route::resource('budgets', \App\Http\Controllers\BudgetController::class);
    Route::get('api/budgets/check', [\App\Http\Controllers\BudgetController::class, 'check'])->name('budgets.check');

    // Security & Approval Routes
    Route::resource('roles', \App\Http\Controllers\RoleController::class);
    Route::resource('approval-rules', \App\Http\Controllers\ApprovalRuleController::class);
    Route::resource('procurement-types', \App\Http\Controllers\ProcurementTypeController::class);

    // Procurement Management
    Route::resource('purchase-requisitions', \App\Http\Controllers\PurchaseRequisitionController::class);
    Route::post('purchase-requisitions/{purchase_requisition}/submit', [\App\Http\Controllers\PurchaseRequisitionController::class, 'submit'])->name('purchase-requisitions.submit');
    Route::post('purchase-requisitions/{purchase_requisition}/cancel', [\App\Http\Controllers\PurchaseRequisitionController::class, 'cancel'])->name('purchase-requisitions.cancel');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');
});
