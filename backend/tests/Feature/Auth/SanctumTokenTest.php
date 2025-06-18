<?php

namespace Tests\Feature\Auth;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SanctumTokenTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test authenticated route returns correct data with valid Sanctum token.
     */
    public function test_authenticated_route_with_valid_token(): void
    {
        // Create a user
        $user = User::factory()->create();
        
        // Create a token for the user
        $token = $user->createToken('test-token')->plainTextToken;

        // Make request with token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->getJson('/api/auth/user');

        // Assert response contains user data
        $response->assertStatus(200)
            ->assertJson([
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
            ]);
    }

    /**
     * Test access to protected route without token returns 401 Unauthorized.
     */
    public function test_protected_route_without_token(): void
    {
        // Make request without token
        $response = $this->getJson('/api/auth/user');

        // Assert unauthorized response
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    /**
     * Test access to protected route with invalid token returns 401 Unauthorized.
     */
    public function test_protected_route_with_invalid_token(): void
    {
        // Make request with invalid token
        $response = $this->withHeaders([
            'Authorization' => 'Bearer invalid-token',
        ])->getJson('/api/auth/user');

        // Assert unauthorized response
        $response->assertStatus(401)
            ->assertJson([
                'message' => 'Unauthenticated.',
            ]);
    }

    /**
     * Test token is deleted from database after logout.
     */
    public function test_token_invalidated_after_logout(): void
    {
        // Create a user
        $user = User::factory()->create();
        
        // Create a token for the user
        $token = $user->createToken('test-token')->plainTextToken;

        // Verify token exists in database
        $this->assertCount(1, $user->tokens);

        // Logout with token
        $this->withHeaders([
            'Authorization' => 'Bearer ' . $token,
        ])->postJson('/api/auth/logout');

        // Verify the token was deleted from the database
        $this->assertCount(0, $user->fresh()->tokens);
    }
}
