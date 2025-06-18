<?php

namespace Tests\Unit\Repositories;

use App\Models\Category;
use App\Models\Product;
use App\Repositories\ProductRepository;
use App\Helpers\QueryParamsTransformer;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Tests\TestCase;

class ProductRepositoryTest extends TestCase
{
    use RefreshDatabase;

    protected ProductRepository $productRepository;

    protected function setUp(): void
    {
        parent::setUp();
        $this->productRepository = new ProductRepository();
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_can_get_all_products()
    {
        // Create test data
        $category = Category::factory()->create();
        $products = Product::factory()->count(3)->create([
            'category_id' => $category->id
        ]);

        // Test getAllWithFilters with no filters
        $result = $this->productRepository->getAllWithFilters([], ['title'], 10, []);
        
        // Assert all products are returned
        $this->assertEquals(3, $result->count());
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function it_can_find_product_by_id()
    {
        // Create test product
        $product = Product::factory()->create();
        
        // Test findById method
        $result = $this->productRepository->findById($product->id);
        
        // Assert the correct product is returned
        $this->assertNotNull($result);
        $this->assertEquals($product->id, $result->id);
    }
    
    #[\PHPUnit\Framework\Attributes\Test]
    public function it_returns_null_for_nonexistent_product_id()
    {
        // Test findById with nonexistent ID
        $result = $this->productRepository->findById(999);
        
        // Assert null is returned
        $this->assertNull($result);
    }
}
