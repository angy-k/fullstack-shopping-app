<?php

namespace App\Helpers;

use Illuminate\Http\Request;

class QueryParamsTransformer
{
    /**
     * Transform regular query parameters to Spatie Query Builder format.
     *
     * @param Request $request
     * @param array $allowedFilters
     * @return Request
     */
    public static function transform(Request $request, array $allowedFilters = []): Request
    {
        $query = $request->query();

        $transformedQuery = [];

        if (isset($query['category'])) {
            $transformedQuery['filter']['category_id'] = $query['category'];
        }

        if (isset($query['minPrice']) || isset($query['maxPrice'])) {
            $priceParams = [];
            if (isset($query['minPrice'])) {
                $priceParams['min'] = $query['minPrice'];
            }
            if (isset($query['maxPrice'])) {
                $priceParams['max'] = $query['maxPrice'];
            }
            $transformedQuery['filter']['price_between'] = $priceParams;
        }

        if (isset($query['minStock'])) {
            $transformedQuery['filter']['stock_min'] = $query['minStock'];
        }

        if (isset($query['search'])) {
            $transformedQuery['filter']['title'] = $query['search'];
        }

        if (isset($query['sortBy'])) {
            $direction = isset($query['sortDir']) && strtolower($query['sortDir']) === 'desc' ? '-' : '';
            $transformedQuery['sort'] = $direction . $query['sortBy'];
        }

        if (isset($query['page'])) {
            $transformedQuery['page'] = $query['page'];
        }
        
        if (isset($query['perPage'])) {
            $transformedQuery['per_page'] = $query['perPage'];
        }
        
        // Merge transformed query with original query
        $request->query->replace($transformedQuery);
        
        return $request;
    }
}