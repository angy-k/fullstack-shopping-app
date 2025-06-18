<?php

namespace App\Http\Controllers\Api;

use App\Helpers\QueryParamsTransformer;
use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Http\Resources\ProductCollection;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

class ProductController extends Controller
{
    /**
     * The product repository instance.
     *
     * @var ProductRepositoryInterface
     */
    protected $productRepository;

    /**
     * Create a new controller instance.
     *
     * @param ProductRepositoryInterface $productRepository
     * @return void
     */
    public function __construct(ProductRepositoryInterface $productRepository)
    {
        $this->productRepository = $productRepository;
    }

    /**
     * Display a listing of the resource.
     *
     * @param Request $request
     * @return AnonymousResourceCollection
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        // Transform query parameters to Spatie Query Builder format
        $request = QueryParamsTransformer::transform($request);

        $products = $this->productRepository->getAllWithFilters(
            $request->filter ?? [],
            ['title', 'price', 'stock_quantity', 'created_at'],
            $request->input('per_page', 12),
            $request->query()
        );

        return ProductResource::collection($products);
    }

    /**
     * Display the specified resource.
     *
     * @param string $id
     * @return ProductResource|JsonResponse
     */
    public function show(string $id): ProductResource|JsonResponse
    {
        $product = $this->productRepository->findById($id);

        if (!$product) {
            return response()->json([
                'message' => 'Product not found',
            ], 404);
        }

        return new ProductResource($product);
    }
}
