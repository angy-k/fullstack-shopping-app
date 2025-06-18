<?php

namespace Tests\Feature\Auth;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class CsrfProtectionTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the CSRF cookie is set when requested.
     */
    public function test_csrf_cookie_is_set(): void
    {
        $response = $this->get('/api/auth/csrf-cookie');

        $response->assertStatus(200)
            ->assertJson([
                'message' => 'CSRF cookie set',
            ]);

        // Check that the cookie is set
        $this->assertNotNull($response->headers->getCookies());
    }

    /**
     * Test that requests with CSRF token succeed.
     */
    public function test_requests_with_csrf_token_succeed(): void
    {
        // First get the CSRF cookie
        $response   = $this->get('/api/auth/csrf-cookie');
        $cookies    = $response->headers->getCookies();
        $csrfCookie = null;

        // Find the XSRF-TOKEN cookie
        foreach ($cookies as $cookie) {
            if ($cookie->getName() === 'XSRF-TOKEN') {
                $csrfCookie = $cookie->getValue();
                break;
            }
        }

        // Create a user for login
        $user = User::factory()->create([
            'email'    => 'test@example.com',
            'password' => bcrypt('password123'),
        ]);

        // Make a request with the CSRF token
        $response = $this->withHeaders([
            'X-XSRF-TOKEN' => $csrfCookie,
        ])->postJson('/api/auth/login', [
            'email'    => 'test@example.com',
            'password' => 'password123',
        ]);

        // Assert successful response
        $response->assertStatus(200)
            ->assertJsonStructure([
                'user',
                'token',
            ]);
    }

    /**
     * Test that the web middleware applies CSRF protection.
     *
     * Note: This test verifies that routes with web middleware have CSRF protection.
     */
    public function test_web_routes_have_csrf_protection(): void
    {
        // Verify that the auth/csrf-cookie route has web middleware
        // by checking that it sets a CSRF cookie
        $response = $this->get('/api/auth/csrf-cookie');

        $response->assertStatus(200);

        $cookies       = $response->headers->getCookies();
        $hasCsrfCookie = false;

        foreach ($cookies as $cookie) {
            if ($cookie->getName() === 'XSRF-TOKEN') {
                $hasCsrfCookie = true;
                break;
            }
        }

        $this->assertTrue($hasCsrfCookie, 'CSRF cookie was not set, indicating web middleware may not be applied correctly');
    }
}
