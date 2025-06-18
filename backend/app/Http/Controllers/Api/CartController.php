<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Get the current user's cart with items.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();
        $cart = $this->cartService->getOrCreateCart($user);
        $cart->load('items.product');

        return response()->json([
            'cart' => $cart,
            'total' => $this->cartService->getCartTotal($cart)
        ]);
    }

    /**
     * Add an item to the cart.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function addItem(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'product_id' => 'required|integer|exists:products,id',
            'quantity' => 'integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        $cart = $this->cartService->getOrCreateCart($user);
        
        $cartItem = $this->cartService->addItem(
            $cart, 
            $request->product_id, 
            $request->quantity ?? 1
        );

        return response()->json([
            'message' => 'Item added to cart successfully',
            'cart_item' => $cartItem->load('product'),
            'cart' => $cart->fresh(['items.product']),
            'total' => $this->cartService->getCartTotal($cart)
        ]);
    }

    /**
     * Update cart item quantity.
     *
     * @param Request $request
     * @param int $id
     * @return JsonResponse
     */
    public function updateItem(Request $request, int $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:0|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        $cart = $this->cartService->getOrCreateCart($user);
        
        $cartItem = $this->cartService->updateItemQuantity(
            $cart, 
            $id, 
            $request->quantity
        );

        $cart = $cart->fresh(['items.product']);

        return response()->json([
            'message' => $request->quantity > 0 
                ? 'Cart item updated successfully' 
                : 'Cart item removed successfully',
            'cart_item' => $cartItem,
            'cart' => $cart,
            'total' => $this->cartService->getCartTotal($cart)
        ]);
    }

    /**
     * Remove an item from the cart.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function removeItem(int $id): JsonResponse
    {
        $user = Auth::user();
        $cart = $this->cartService->getOrCreateCart($user);
        
        $this->cartService->removeItem($cart, $id);
        
        $cart = $cart->fresh(['items.product']);

        return response()->json([
            'message' => 'Cart item removed successfully',
            'cart' => $cart,
            'total' => $this->cartService->getCartTotal($cart)
        ]);
    }

    /**
     * Clear all items from the cart.
     *
     * @return JsonResponse
     */
    public function clear(): JsonResponse
    {
        $user = Auth::user();
        $cart = $this->cartService->getOrCreateCart($user);
        
        $this->cartService->clearCart($cart);

        return response()->json([
            'message' => 'Cart cleared successfully',
            'cart' => $cart->fresh(),
            'total' => 0
        ]);
    }

    /**
     * Merge a guest cart into the authenticated user's cart.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function mergeCart(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array',
            'items.*.product_id' => 'required|integer|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1|max:100',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        $cart = $this->cartService->getOrCreateCart($user);
        
        $this->cartService->mergeGuestCart($cart, $request->items);
        
        $cart = $cart->fresh(['items.product']);

        return response()->json([
            'message' => 'Guest cart merged successfully',
            'cart' => $cart,
            'total' => $this->cartService->getCartTotal($cart)
        ]);
    }
}
