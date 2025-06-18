<?php

namespace App\Repositories;

use App\Models\Product;
use App\Repositories\Interfaces\ProductRepositoryInterface;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;
use Spatie\QueryBuilder\AllowedFilter;
use Spatie\QueryBuilder\QueryBuilder;

class ProductRepository implements ProductRepositoryInterface
{
    /**
     * Get all products with filters, sorting and pagination
     *
     * @param array $filters
     * @param array $sorts
     * @param int $perPage
     * @param array $queryParams
     * @return LengthAwarePaginator
     */
    public function getAllWithFilters(array $filters, array $sorts, int $perPage, array $queryParams): LengthAwarePaginator
    {
        return QueryBuilder::for(Product::class)
            ->allowedFilters([
                AllowedFilter::exact('category_id', 'category.id'),
                AllowedFilter::callback('price_between', function (Builder $query, $value) {
                    // Ensure we have valid min and max values
                    $min = isset($value['min']) ? $value['min'] : 0;
                    $max = isset($value['max']) ? $value['max'] : PHP_INT_MAX;
                    $query->whereBetween('price', [$min, $max]);
                }),
                AllowedFilter::scope('stock_min'),
                AllowedFilter::partial('title'),
            ])
            ->allowedSorts($sorts)
            ->defaultSort('-created_at')
            ->with('category')
            ->paginate($perPage)
            ->appends($queryParams);
    }
    
    /**
     * Find product by ID
     *
     * @param string $id
     * @return Product|null
     */
    public function findById(string $id): ?Product
    {
        return Product::with('category')->find($id);
    }
}
