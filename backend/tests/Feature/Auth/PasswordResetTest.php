<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Facades\Notification;
use Illuminate\Auth\Notifications\ResetPassword;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PasswordResetTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test forgot password sends reset email.
     */
    public function test_forgot_password_sends_reset_email(): void
    {
        Notification::fake();

        $user = User::factory()->create();

        $response = $this->postJson('/api/auth/forgot-password', [
            'email' => $user->email,
        ]);

        $response->assertStatus(200);
        
        Notification::assertSentTo($user, ResetPassword::class);
    }

    /**
     * Test forgot password with non-existent email.
     * 
     * Note: Laravel's default behavior is to return a 422 with a validation error
     * when the email doesn't exist. In a production app, you might want to change
     * this behavior to always return 200 for security reasons.
     */
    public function test_forgot_password_with_nonexistent_email(): void
    {
        Notification::fake();

        $response = $this->postJson('/api/auth/forgot-password', [
            'email' => 'nonexistent@example.com',
        ]);

        // Laravel's default behavior returns 422 when email doesn't exist
        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
        
        Notification::assertNothingSent();
    }

    /**
     * Test forgot password with invalid email format.
     */
    public function test_forgot_password_with_invalid_email_format(): void
    {
        $response = $this->postJson('/api/auth/forgot-password', [
            'email' => 'not-an-email',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test password reset with valid token.
     */
    public function test_password_reset_with_valid_token(): void
    {
        $user = User::factory()->create();
        
        // Create a password reset token
        $token = Password::createToken($user);
        
        $response = $this->postJson('/api/auth/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        $response->assertStatus(200);
        
        // Verify password was changed
        $this->assertTrue(Hash::check('NewPassword123!', $user->fresh()->password));
    }

    /**
     * Test password reset with invalid token.
     */
    public function test_password_reset_with_invalid_token(): void
    {
        $user = User::factory()->create();
        
        $response = $this->postJson('/api/auth/reset-password', [
            'token' => 'invalid-token',
            'email' => $user->email,
            'password' => 'NewPassword123!',
            'password_confirmation' => 'NewPassword123!',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['email']);
    }

    /**
     * Test password reset with mismatched passwords.
     */
    public function test_password_reset_with_mismatched_passwords(): void
    {
        $user = User::factory()->create();
        
        // Create a password reset token
        $token = Password::createToken($user);
        
        $response = $this->postJson('/api/auth/reset-password', [
            'token' => $token,
            'email' => $user->email,
            'password' => 'NewPassword123!',
            'password_confirmation' => 'DifferentPassword123!',
        ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['password']);
    }
}
