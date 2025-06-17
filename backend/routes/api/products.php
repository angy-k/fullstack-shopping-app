<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Product API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all product related API routes.
| These routes are loaded by the RouteServiceProvider.
|
*/

// Public product routes
// Public product routes
Route::get('products', function() {
    return response()->json(['message' => 'Products API endpoint']);
});
