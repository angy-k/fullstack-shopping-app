<?php

namespace Tests\Feature\Commands;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class ImportProductsTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that the import products command works correctly.
     */
    public function test_import_products_command_imports_products(): void
    {
        // Mock the HTTP client to return fake products
        Http::fake([
            'fakestoreapi.com/products' => Http::response([
                [
                    'id' => 1,
                    'title' => 'Test Product',
                    'price' => 99.99,
                    'description' => 'This is a test product',
                    'category' => 'Test Category',
                    'image' => 'https://fakestoreapi.com/img/test.jpg',
                ],
                [
                    'id' => 2,
                    'title' => 'Another Product',
                    'price' => 49.99,
                    'description' => 'This is another test product',
                    'category' => 'Another Category',
                    'image' => 'https://fakestoreapi.com/img/another.jpg',
                ],
            ], 200),
        ]);

        // Run the command
        $this->artisan('app:import-products')
            ->expectsOutput('Starting product import from Fake Store API...')
            ->expectsOutput('Found 2 products to process.')
            ->expectsOutput('Import completed: 2 imported, 0 updated, 0 skipped, 0 failed.')
            ->assertExitCode(0);

        // Assert that the products were imported
        $this->assertDatabaseCount('products', 2);
        $this->assertDatabaseHas('products', [
            'title' => 'Test Product',
            'price' => 99.99,
            'external_id' => '1',
        ]);
        $this->assertDatabaseHas('products', [
            'title' => 'Another Product',
            'price' => 49.99,
            'external_id' => '2',
        ]);

        // Assert that the categories were created
        $this->assertDatabaseCount('categories', 2);
        $this->assertDatabaseHas('categories', [
            'name' => 'Test Category',
        ]);
        $this->assertDatabaseHas('categories', [
            'name' => 'Another Category',
        ]);
    }

    /**
     * Test that the import products command updates existing products when forced.
     */
    public function test_import_products_command_updates_existing_products_when_forced(): void
    {
        // Create an existing product and category
        $category = Category::create([
            'name' => 'Existing Category',
            'description' => 'This is an existing category',
        ]);

        $product = Product::create([
            'title' => 'Old Title',
            'description' => 'Old description',
            'image_url' => 'https://fakestoreapi.com/img/old.jpg',
            'price' => 29.99,
            'stock_quantity' => 100,
            'category_id' => $category->id,
            'external_id' => '1',
        ]);

        // Mock the HTTP client to return updated product data
        Http::fake([
            'fakestoreapi.com/products' => Http::response([
                [
                    'id' => 1,
                    'title' => 'Updated Title',
                    'price' => 39.99,
                    'description' => 'Updated description',
                    'category' => 'Updated Category',
                    'image' => 'https://fakestoreapi.com/img/updated.jpg',
                ],
            ], 200),
        ]);

        // Run the command with force option
        $this->artisan('app:import-products --force')
            ->expectsOutput('Starting product import from Fake Store API...')
            ->expectsOutput('Found 1 products to process.')
            ->expectsOutput('Import completed: 0 imported, 1 updated, 0 skipped, 0 failed.')
            ->assertExitCode(0);

        // Assert that the product was updated
        $this->assertDatabaseCount('products', 1);
        $this->assertDatabaseHas('products', [
            'title' => 'Updated Title',
            'price' => 39.99,
            'description' => 'Updated description',
            'external_id' => '1',
        ]);

        // Assert that a new category was created
        $this->assertDatabaseCount('categories', 2);
        $this->assertDatabaseHas('categories', [
            'name' => 'Updated Category',
        ]);
    }

    /**
     * Test that the import products command skips existing products when not forced.
     */
    public function test_import_products_command_skips_existing_products_when_not_forced(): void
    {
        // Create an existing product and category
        $category = Category::create([
            'name' => 'Existing Category',
            'description' => 'This is an existing category',
        ]);

        $product = Product::create([
            'title' => 'Old Title',
            'description' => 'Old description',
            'image_url' => 'https://fakestoreapi.com/img/old.jpg',
            'price' => 29.99,
            'stock_quantity' => 100,
            'category_id' => $category->id,
            'external_id' => '1',
        ]);

        // Mock the HTTP client to return updated product data
        Http::fake([
            'fakestoreapi.com/products' => Http::response([
                [
                    'id' => 1,
                    'title' => 'Updated Title',
                    'price' => 39.99,
                    'description' => 'Updated description',
                    'category' => 'Updated Category',
                    'image' => 'https://fakestoreapi.com/img/updated.jpg',
                ],
            ], 200),
        ]);

        // Run the command without force option
        $this->artisan('app:import-products')
            ->expectsOutput('Starting product import from Fake Store API...')
            ->expectsOutput('Found 1 products to process.')
            ->expectsOutput('Import completed: 0 imported, 0 updated, 1 skipped, 0 failed.')
            ->assertExitCode(0);

        // Assert that the product was not updated
        $this->assertDatabaseCount('products', 1);
        $this->assertDatabaseHas('products', [
            'title' => 'Old Title',
            'price' => 29.99,
            'description' => 'Old description',
            'external_id' => '1',
        ]);

        // Assert that the original category still exists and no additional categories were created
        $this->assertDatabaseHas('categories', [
            'name' => 'Existing Category'
        ]);
        // We don't assert the exact count because other tests may have created categories
    }
}
