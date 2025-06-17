<?php

use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register global API routes for your application.
| These routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Global API status route
Route::get('/status', function () {
    return response()->json([
        'status'      => 'API is running',
        'version'     => '1.0.0',
        'environment' => app()->environment(),
        'timestamp'   => now()->toIso8601String(),
    ]);
});

// Dynamically load all route files from the routes/api directory
$apiRoutesPath = base_path('routes/api');
if (File::isDirectory($apiRoutesPath)) {
    $files = File::files($apiRoutesPath);

    foreach ($files as $file) {
        if ($file->getExtension() === 'php') {
            require $file->getPathname();
        }
    }
}
