<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Health API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register health check related API routes.
| These routes are loaded by the RouteServiceProvider.
|
*/

Route::get('health', function () {
    return response()->json(['status' => 'ok']);
});
