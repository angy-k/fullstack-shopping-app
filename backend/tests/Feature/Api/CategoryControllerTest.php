<?php

namespace Tests\Feature\Api;

use App\Models\Category;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class CategoryControllerTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_can_list_all_categories()
    {
        // Create test categories
        $categories = Category::factory()->count(3)->create();

        // Make request to the categories endpoint
        $response = $this->getJson('/api/categories');

        // Assert response is successful and has correct structure
        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        '*' => [
                            'id',
                            'name'
                        ]
                    ]
                ]);

        // Assert all categories are returned
        $this->assertCount(3, $response->json('data'));

        // Assert each category is in the response
        foreach ($categories as $category) {
            $response->assertJsonFragment([
                'id' => $category->id,
                'name' => $category->name
            ]);
        }
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_returns_empty_array_when_no_categories_exist()
    {
        // Make request to the categories endpoint with no categories in DB
        $response = $this->getJson('/api/categories');

        // Assert response is successful and has empty data array
        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data'
                ])
                ->assertJsonCount(0, 'data');
    }
}
