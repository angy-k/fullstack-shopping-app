<?php

use Illuminate\Support\Facades\Route;
use Laravel\Sanctum\Http\Controllers\CsrfCookieController;

/*
|--------------------------------------------------------------------------
| Sanctum Routes
|--------------------------------------------------------------------------
|
| Here is where Sanctum-specific routes are registered. These routes
| need to use the web middleware group to function properly.
|
*/

// Sanctum CSRF cookie route - must use web middleware
Route::get('/sanctum/csrf-cookie', [CsrfCookieController::class, 'show']);
