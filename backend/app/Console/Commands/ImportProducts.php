<?php

namespace App\Console\Commands;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class ImportProducts extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:import-products {--force : Force import even if products exist}'
                          . ' {--limit= : Limit the number of products to import}'; 

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Import products from Fake Store API into the database';

    /**
     * The Fake Store API base URL.
     *
     * @var string
     */
    protected $apiBaseUrl = 'https://fakestoreapi.com';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting product import from Fake Store API...');

        try {
            // Fetch products from the API
            $products = $this->fetchProducts();
            
            if (empty($products)) {
                $this->error('No products found in the API response.');
                return 1;
            }

            $limit = $this->option('limit') ? (int) $this->option('limit') : null;
            if ($limit) {
                $products = array_slice($products, 0, $limit);
                $this->info("Limited import to {$limit} products.");
            }

            $this->info('Found ' . count($products) . ' products to process.');
            
            // Process each product
            $imported = 0;
            $updated = 0;
            $skipped = 0;
            $failed = 0;

            foreach ($products as $productData) {
                $result = $this->processProduct($productData);
                
                if ($result === 'imported') {
                    $imported++;
                } elseif ($result === 'updated') {
                    $updated++;
                } elseif ($result === 'skipped') {
                    $skipped++;
                } else {
                    $failed++;
                }
            }

            $this->info("Import completed: {$imported} imported, {$updated} updated, {$skipped} skipped, {$failed} failed.");
            return 0;

        } catch (\Exception $e) {
            $this->error('Error during product import: ' . $e->getMessage());
            Log::error('Product import failed: ' . $e->getMessage(), [
                'exception' => $e,
            ]);
            return 1;
        }
    }

    /**
     * Fetch products from the Fake Store API.
     *
     * @return array
     */
    protected function fetchProducts(): array
    {
        $this->info('Fetching products from API...');
        
        $response = Http::get("{$this->apiBaseUrl}/products");
        
        if (!$response->successful()) {
            $this->error('Failed to fetch products: ' . $response->status());
            return [];
        }
        
        return $response->json() ?: [];
    }

    /**
     * Process a single product from the API.
     *
     * @param array $productData
     * @return string Status: 'imported', 'updated', 'skipped', or 'failed'
     */
    protected function processProduct(array $productData): string
    {
        // Validate the product data
        $validator = Validator::make($productData, [
            'id' => 'required|numeric',
            'title' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'description' => 'nullable|string',
            'category' => 'required|string|max:255',
            'image' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            if ($this->getOutput()->isVerbose()) {
                $this->error("Validation failed for product ID {$productData['id']}: " . json_encode($validator->errors()->toArray()));
            }
            return 'failed';
        }

        // Find or create the category
        $category = $this->findOrCreateCategory($productData['category']);
        if (!$category) {
            return 'failed';
        }

        // Check if the product already exists by external_id
        $existingProduct = Product::where('external_id', (string) $productData['id'])->first();

        if ($existingProduct) {
            // Skip if not forced to update
            if (!$this->option('force')) {
                if ($this->getOutput()->isVerbose()) {
                    $this->line("Skipping existing product: {$productData['title']}");
                }
                return 'skipped';
            }

            // Update the existing product
            $existingProduct->update([
                'title' => $productData['title'],
                'description' => $productData['description'] ?? null,
                'image_url' => $productData['image'] ?? null,
                'price' => $productData['price'],
                'category_id' => $category->id,
            ]);

            if ($this->getOutput()->isVerbose()) {
                $this->info("Updated product: {$productData['title']}");
            }
            return 'updated';
        }

        // Create a new product
        try {
            Product::create([
                'title' => $productData['title'],
                'description' => $productData['description'] ?? null,
                'image_url' => $productData['image'] ?? null,
                'price' => $productData['price'],
                'stock_quantity' => 100, // Default stock quantity
                'category_id' => $category->id,
                'external_id' => (string) $productData['id'],
            ]);

            if ($this->getOutput()->isVerbose()) {
                $this->info("Imported new product: {$productData['title']}");
            }
            return 'imported';
        } catch (\Exception $e) {
            if ($this->getOutput()->isVerbose()) {
                $this->error("Failed to import product {$productData['title']}: {$e->getMessage()}");
            }
            Log::error("Product import failed for ID {$productData['id']}", [
                'exception' => $e,
                'product' => $productData,
            ]);
            return 'failed';
        }
    }

    /**
     * Find or create a category by name.
     *
     * @param string $categoryName
     * @return Category|null
     */
    protected function findOrCreateCategory(string $categoryName): ?Category
    {
        try {
            $category = Category::firstOrCreate(
                ['name' => $categoryName],
                ['description' => "Category imported from Fake Store API: {$categoryName}"]
            );

            if ($this->getOutput()->isVerbose()) {
                $this->line("Using category: {$categoryName}");
            }

            return $category;
        } catch (\Exception $e) {
            $this->error("Failed to find or create category '{$categoryName}': {$e->getMessage()}");
            Log::error("Category creation failed: {$categoryName}", [
                'exception' => $e,
            ]);
            return null;
        }
    }
}
