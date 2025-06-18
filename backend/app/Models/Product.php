<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'image_url',
        'price',
        'stock_quantity',
        'category_id',
        'external_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'price' => 'decimal:2',
        'stock_quantity' => 'integer',
    ];

    /**
     * Get the category that owns the product.
     */
    public function category(): BelongsTo
    {
        return $this->belongsTo(Category::class);
    }
    
    /**
     * Scope a query to filter products by price range.
     *
     * @param Builder $query
     * @param array $price
     * @return Builder
     */
    public function scopePriceBetween(Builder $query, array $price): Builder
    {
        if (isset($price['min'])) {
            $query->where('price', '>=', $price['min']);
        }
        
        if (isset($price['max'])) {
            $query->where('price', '<=', $price['max']);
        }
        
        return $query;
    }
    
    /**
     * Scope a query to filter products by minimum stock quantity.
     *
     * @param Builder $query
     * @param int $min
     * @return Builder
     */
    public function scopeStockMin(Builder $query, int $min): Builder
    {
        return $query->where('stock_quantity', '>=', $min);
    }
}
