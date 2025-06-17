<?php

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
Route::group(['middleware' => ['auth:sanctum'], 'namespace' => 'Api'], function () {
    Route::get('orders', function() {
        return response()->json(['message' => 'Orders API endpoint']);
    });
});
