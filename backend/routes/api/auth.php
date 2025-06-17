<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Password;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\Auth\ResetPasswordController;
use App\Http\Controllers\Auth\ForgotPasswordController;

/*
|--------------------------------------------------------------------------
| Authentication API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all authentication related API routes.
| These routes are loaded by the RouteServiceProvider.
|
*/

Route::prefix('auth')->group(function () {
    // Public authentication routes
    Route::post('login', [AuthController::class, 'login']);
    Route::post('register', [RegisterController::class, 'register']);
    Route::get('csrf-cookie', [AuthController::class, 'csrf'])->middleware('web');
    Route::post('forgot-password', [ForgotPasswordController::class, 'sendResetLinkEmail'])->name('password.email');
    Route::post('reset-password', [ResetPasswordController::class, 'reset'])->name('password.update');

    // Password reset link handler
    Route::get('reset-password/{token}', function ($token) {
        $email = request('email');

        return redirect(env('SPA_URL', 'http://localhost:5173') . '/reset-password?token=' . $token . '&email=' . $email);
    })->name('password.reset');

    // Protected authentication routes
    Route::group(['middleware' => ['auth:sanctum'], 'namespace' => 'Api'], function () {
        Route::post('logout', [AuthController::class, 'logout']);
        Route::get('user', [AuthController::class, 'user']);
    });
});
