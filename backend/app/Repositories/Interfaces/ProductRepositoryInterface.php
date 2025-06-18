<?php

namespace App\Repositories\Interfaces;

use Illuminate\Pagination\LengthAwarePaginator;
use App\Models\Product;

interface ProductRepositoryInterface
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
    public function getAllWithFilters(array $filters, array $sorts, int $perPage, array $queryParams): LengthAwarePaginator;
    
    /**
     * Find product by ID
     *
     * @param string $id
     * @return Product|null
     */
    public function findById(string $id): ?Product;
}
