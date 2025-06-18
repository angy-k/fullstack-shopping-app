<?php

namespace App\Console\Commands;

use App\Services\CartService;
use Illuminate\Console\Command;

class CleanOldCartItems extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'cart:clean {days=3 : Number of days to keep cart items}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Clean up cart items older than the specified number of days';

    /**
     * Execute the console command.
     */
    public function handle(CartService $cartService): int
    {
        $days = (int) $this->argument('days');
        
        $this->info("Cleaning up cart items older than {$days} days...");
        
        $count = $cartService->deleteOldCartItems($days);
        
        $this->info("Successfully deleted {$count} old cart items.");
        
        return Command::SUCCESS;
    }
}
