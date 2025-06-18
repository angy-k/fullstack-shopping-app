<?php

namespace Tests\Feature\Api;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_can_list_all_products()
    {
        // Create test data
        $category = Category::factory()->create();
        $products = Product::factory()->count(3)->create([
            'category_id' => $category->id
        ]);

        // Make request to the products endpoint
        $response = $this->getJson('/api/products');

        // Assert response is successful and has correct structure
        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        '*' => [
                            'id',
                            'title',
                            'description',
                            'price',
                            'image_url',
                            'stock_quantity',
                            'category' => [
                                'id',
                                'name'
                            ]
                        ]
                    ],
                    'links',
                    'meta'
                ]);

        // Assert all products are returned
        $this->assertCount(3, $response->json('data'));
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_can_filter_products_by_category()
    {
        // Create test categories
        $electronicsCategory = Category::factory()->create(['name' => 'Electronics']);
        $clothingCategory = Category::factory()->create(['name' => 'Clothing']);
        
        // Create products in different categories
        $laptop = Product::factory()->create([
            'title' => 'Laptop',
            'category_id' => $electronicsCategory->id
        ]);
        
        $phone = Product::factory()->create([
            'title' => 'Phone',
            'category_id' => $electronicsCategory->id
        ]);
        
        $tshirt = Product::factory()->create([
            'title' => 'T-shirt',
            'category_id' => $clothingCategory->id
        ]);

        // Make request with category filter using the format expected by QueryParamsTransformer
        $response = $this->getJson("/api/products?category={$electronicsCategory->id}");

        // Assert response is successful
        $response->assertStatus(200);

        // Get the returned product IDs
        $returnedIds = collect($response->json('data'))->pluck('id')->toArray();
        
        // Assert that the electronics products are in the results
        $this->assertContains($laptop->id, $returnedIds);
        $this->assertContains($phone->id, $returnedIds);
        
        // Assert that the clothing product is not in the results
        $this->assertNotContains($tshirt->id, $returnedIds);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_can_filter_products_by_price_range()
    {
        // Create test data
        $category = Category::factory()->create();
        
        // Create products with different prices
        $budgetPhone = Product::factory()->create([
            'title' => 'Budget Phone',
            'price' => 200,
            'category_id' => $category->id
        ]);
        
        $midRangeLaptop = Product::factory()->create([
            'title' => 'Mid-range Laptop',
            'price' => 800,
            'category_id' => $category->id
        ]);
        
        $premiumLaptop = Product::factory()->create([
            'title' => 'Premium Laptop',
            'price' => 1500,
            'category_id' => $category->id
        ]);

        // Make request with price range filter using the format expected by QueryParamsTransformer
        $response = $this->getJson('/api/products?minPrice=700&maxPrice=1000');

        // Assert response is successful
        $response->assertStatus(200);

        // Get the returned product IDs
        $returnedIds = collect($response->json('data'))->pluck('id')->toArray();
        
        // Assert that the mid-range laptop is in the results
        $this->assertContains($midRangeLaptop->id, $returnedIds);
        
        // Assert that the budget phone and premium laptop are not in the results
        $this->assertNotContains($budgetPhone->id, $returnedIds);
        $this->assertNotContains($premiumLaptop->id, $returnedIds);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_can_filter_products_by_title()
    {
        // Create test data
        $category = Category::factory()->create();
        
        // Create products with different titles
        $laptop = Product::factory()->create([
            'title' => 'Laptop Dell XPS',
            'category_id' => $category->id
        ]);
        
        $macbook = Product::factory()->create([
            'title' => 'MacBook Pro',
            'category_id' => $category->id
        ]);
        
        $phone = Product::factory()->create([
            'title' => 'iPhone 15',
            'category_id' => $category->id
        ]);

        // Make request with title filter using the format expected by QueryParamsTransformer
        $response = $this->getJson('/api/products?search=Laptop');

        // Assert response is successful
        $response->assertStatus(200);

        // Get the returned product IDs
        $returnedIds = collect($response->json('data'))->pluck('id')->toArray();
        
        // Assert that the laptop is in the results
        $this->assertContains($laptop->id, $returnedIds);
        
        // Assert that the macbook and phone are not in the results
        $this->assertNotContains($macbook->id, $returnedIds);
        $this->assertNotContains($phone->id, $returnedIds);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_can_get_a_single_product()
    {
        // Create test data
        $category = Category::factory()->create(['name' => 'Electronics']);
        $product = Product::factory()->create([
            'title' => 'Test Product',
            'category_id' => $category->id
        ]);

        // Make request to get the product
        $response = $this->getJson("/api/products/{$product->id}");

        // Assert response is successful and has correct structure
        $response->assertStatus(200)
                ->assertJsonStructure([
                    'data' => [
                        'id',
                        'title',
                        'description',
                        'price',
                        'image_url',
                        'stock_quantity',
                        'category' => [
                            'id',
                            'name'
                        ]
                    ]
                ]);

        // Assert the correct product is returned
        $response->assertJson([
            'data' => [
                'id' => $product->id,
                'title' => $product->title,
                'category' => [
                    'id' => $category->id,
                    'name' => $category->name
                ]
            ]
        ]);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_returns_404_for_nonexistent_product()
    {
        // Make request for a nonexistent product
        $response = $this->getJson('/api/products/999');

        // Assert response is 404
        $response->assertStatus(404)
                ->assertJson([
                    'message' => 'Product not found'
                ]);
    }
}
