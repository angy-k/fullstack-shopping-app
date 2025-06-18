<?php

use App\Http\Controllers\Api\CategoryController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Category API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all category related API routes.
| These routes are loaded by the RouteServiceProvider.
|
*/

// Public category route - only need listing functionality
Route::get('categories', [CategoryController::class, 'index']);
