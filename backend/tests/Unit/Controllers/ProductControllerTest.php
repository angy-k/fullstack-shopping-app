<?php

namespace Tests\Unit\Controllers;

use App\Http\Controllers\Api\ProductController;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Mockery;
use Tests\TestCase;

class ProductControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $productRepositoryMock;
    protected $productController;

    protected function setUp(): void
    {
        parent::setUp();
        $this->productRepositoryMock = Mockery::mock(ProductRepositoryInterface::class);
        $this->productController = new ProductController($this->productRepositoryMock);
    }

    protected function tearDown(): void
    {
        Mockery::close();
        parent::tearDown();
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function index_returns_paginated_products()
    {
        // Create test products
        $products = Product::factory()->count(3)->make();
        
        // Create a paginator with the products
        $paginator = new LengthAwarePaginator(
            $products,
            count($products),
            10,
            1
        );

        // Set up the mock repository to return our paginator
        $this->productRepositoryMock
            ->shouldReceive('getAllWithFilters')
            ->once()
            ->with([], ['title', 'price', 'stock_quantity', 'created_at'], 12, [])
            ->andReturn($paginator);

        // Create a request
        $request = Request::create('/api/products', 'GET');
        
        // Call the controller method
        $response = $this->productController->index($request);
        
        // Assert response is a collection of ProductResource
        $this->assertInstanceOf(\Illuminate\Http\Resources\Json\AnonymousResourceCollection::class, $response);
        $this->assertEquals(3, $response->count());
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function show_returns_product_when_found()
    {
        // Create a test product
        $product = Product::factory()->make(['id' => 1]);
        
        // Set up the mock repository
        $this->productRepositoryMock
            ->shouldReceive('findById')
            ->once()
            ->with('1')
            ->andReturn($product);
        
        // Call the controller method
        $response = $this->productController->show('1');
        
        // Assert response is a ProductResource
        $this->assertInstanceOf(ProductResource::class, $response);
    }

    #[\PHPUnit\Framework\Attributes\Test]
    public function show_returns_404_when_product_not_found()
    {
        // Set up the mock repository to return null
        $this->productRepositoryMock
            ->shouldReceive('findById')
            ->once()
            ->with('999')
            ->andReturn(null);
        
        // Call the controller method
        $response = $this->productController->show('999');
        
        // Assert response is a 404
        $this->assertEquals(404, $response->getStatusCode());
        $this->assertEquals(['message' => 'Product not found'], json_decode($response->getContent(), true));
    }
}
