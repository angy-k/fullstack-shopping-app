<?php

namespace App\Services;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\DB;

class CartService
{
    /**
     * Get or create a cart for a user.
     *
     * @param User $user
     * @return Cart
     */
    public function getOrCreateCart(User $user): Cart
    {
        return Cart::firstOrCreate(['user_id' => $user->id]);
    }

    /**
     * Add an item to the cart.
     *
     * @param Cart $cart
     * @param int $productId
     * @param int $quantity
     * @return CartItem
     */
    public function addItem(Cart $cart, int $productId, int $quantity = 1): CartItem
    {
        $product = Product::findOrFail($productId);
        
        // Check if the item already exists in the cart
        $cartItem = $cart->items()->where('product_id', $productId)->first();
        
        if ($cartItem) {
            // Update quantity if item exists
            $cartItem->quantity += $quantity;
            $cartItem->save();
            return $cartItem;
        }
        
        // Create new cart item if it doesn't exist
        return $cart->items()->create([
            'product_id' => $productId,
            'quantity' => $quantity,
            'price_at_add' => $product->price,
        ]);
    }

    /**
     * Update cart item quantity.
     *
     * @param Cart $cart
     * @param int $cartItemId
     * @param int $quantity
     * @return CartItem|null
     */
    public function updateItemQuantity(Cart $cart, int $cartItemId, int $quantity): ?CartItem
    {
        $cartItem = $cart->items()->findOrFail($cartItemId);
        
        if ($quantity <= 0) {
            $cartItem->delete();
            return null;
        }
        
        $cartItem->quantity = $quantity;
        $cartItem->save();
        
        return $cartItem;
    }

    /**
     * Remove an item from the cart.
     *
     * @param Cart $cart
     * @param int $cartItemId
     * @return bool
     */
    public function removeItem(Cart $cart, int $cartItemId): bool
    {
        $cartItem = $cart->items()->findOrFail($cartItemId);
        return $cartItem->delete();
    }

    /**
     * Clear all items from a cart.
     *
     * @param Cart $cart
     * @return bool
     */
    public function clearCart(Cart $cart): bool
    {
        return $cart->items()->delete();
    }

    /**
     * Merge a guest cart (array of items) into a user's cart.
     *
     * @param Cart $cart
     * @param array $guestCartItems Array of [product_id => quantity]
     * @return Cart
     */
    public function mergeGuestCart(Cart $cart, array $guestCartItems): Cart
    {
        DB::transaction(function () use ($cart, $guestCartItems) {
            foreach ($guestCartItems as $item) {
                if (isset($item['product_id']) && isset($item['quantity'])) {
                    $this->addItem($cart, $item['product_id'], $item['quantity']);
                }
            }
        });
        
        return $cart->load('items.product');
    }

    /**
     * Get the total price of all items in the cart.
     *
     * @param Cart $cart
     * @return float
     */
    public function getCartTotal(Cart $cart): float
    {
        return $cart->items->sum(function ($item) {
            return $item->price_at_add * $item->quantity;
        });
    }

    /**
     * Delete cart items older than specified days.
     *
     * @param int $days
     * @return int Number of deleted items
     */
    public function deleteOldCartItems(int $days = 3): int
    {
        return CartItem::where('created_at', '<', now()->subDays($days))->delete();
    }
}
