<?php

use App\Http\Controllers\API\CartController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Cart API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all cart related API routes.
| These routes are loaded by the RouteServiceProvider.
|
*/

// Protected cart routes
Route::group(['middleware' => ['auth:sanctum']], function () {
    // Cart management routes
    Route::get('cart', [CartController::class, 'index']);
    Route::post('cart/items', [CartController::class, 'addItem']);
    Route::patch('cart/items/{id}', [CartController::class, 'updateItem']);
    Route::delete('cart/items/{id}', [CartController::class, 'removeItem']);
    Route::delete('cart', [CartController::class, 'clear']);
    
    // Merge guest cart with authenticated user cart
    Route::post('cart/merge', [CartController::class, 'mergeCart']);
});
