<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Services\CartService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    protected $cartService;

    public function __construct(CartService $cartService)
    {
        $this->cartService = $cartService;
    }

    /**
     * Get all orders for the authenticated user.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $user = Auth::user();
        $orders = $user->orders()->with('items.product')->latest()->get();

        return response()->json(['orders' => $orders]);
    }

    /**
     * Get a specific order.
     *
     * @param int $id
     * @return JsonResponse
     */
    public function show(int $id): JsonResponse
    {
        $user = Auth::user();
        $order = $user->orders()->with('items.product')->findOrFail($id);

        return response()->json(['order' => $order]);
    }

    /**
     * Create a new order from the user's cart.
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'shipping_name' => 'required|string|max:255',
            'shipping_address' => 'required|string|max:255',
            'shipping_city' => 'required|string|max:255',
            'shipping_state' => 'required|string|max:255',
            'shipping_zip' => 'required|string|max:20',
            'shipping_country' => 'required|string|max:255',
            'shipping_phone' => 'required|string|max:20',
            'shipping_email' => 'required|email|max:255',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = Auth::user();
        $cart = $this->cartService->getOrCreateCart($user);
        $cart->load('items.product');

        // Check if cart is empty
        if ($cart->items->isEmpty()) {
            return response()->json([
                'message' => 'Cannot create order with empty cart',
            ], 400);
        }

        $totalPrice = $this->cartService->getCartTotal($cart);

        try {
            $order = DB::transaction(function () use ($user, $cart, $totalPrice, $request) {
                // Create the order
                $order = Order::create([
                    'user_id' => $user->id,
                    'status' => 'pending',
                    'total_price' => $totalPrice,
                    'shipping_name' => $request->shipping_name,
                    'shipping_address' => $request->shipping_address,
                    'shipping_city' => $request->shipping_city,
                    'shipping_state' => $request->shipping_state,
                    'shipping_zip' => $request->shipping_zip,
                    'shipping_country' => $request->shipping_country,
                    'shipping_phone' => $request->shipping_phone,
                    'shipping_email' => $request->shipping_email,
                    'notes' => $request->notes,
                ]);

                // Create order items from cart items
                foreach ($cart->items as $cartItem) {
                    OrderItem::create([
                        'order_id' => $order->id,
                        'product_id' => $cartItem->product_id,
                        'quantity' => $cartItem->quantity,
                        'price_at_order' => $cartItem->price_at_add,
                    ]);
                }

                // Clear the cart after creating the order
                $this->cartService->clearCart($cart);

                return $order;
            });

            return response()->json([
                'message' => 'Order created successfully',
                'order' => $order->load('items.product'),
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create order',
                'error' => $e->getMessage(),
            ], 500);
        }
    }

    /**
     * Cancel an order (only if it's in pending status).
     *
     * @param int $id
     * @return JsonResponse
     */
    public function cancel(int $id): JsonResponse
    {
        $user = Auth::user();
        $order = $user->orders()->findOrFail($id);

        if ($order->status !== 'pending') {
            return response()->json([
                'message' => 'Only pending orders can be cancelled',
            ], 400);
        }

        $order->status = 'cancelled';
        $order->save();

        return response()->json([
            'message' => 'Order cancelled successfully',
            'order' => $order->fresh(),
        ]);
    }
}
