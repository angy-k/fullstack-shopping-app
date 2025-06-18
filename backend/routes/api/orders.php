<?php

use App\Http\Controllers\API\OrderController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Order API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all order related API routes.
| These routes are loaded by the RouteServiceProvider.
|
*/

// Protected order routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    // Order management routes
    Route::get('orders', [OrderController::class, 'index']);
    Route::get('orders/{id}', [OrderController::class, 'show']);
    Route::post('orders', [OrderController::class, 'store']);
    Route::patch('orders/{id}/cancel', [OrderController::class, 'cancel']);
});
