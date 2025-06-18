<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DefaultUserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Default user credentials
        $defaultUser = [
            'name'              => 'Demo User',
            'email'             => 'demo@example.com',
            'password'          => Hash::make('password123'),
            'email_verified_at' => now(),
        ];

        // Check if the user already exists to prevent duplicates
        if (! User::where('email', $defaultUser['email'])->exists()) {
            User::create($defaultUser);
            $this->command->info('Default user created successfully!');
        } else {
            $this->command->info('Default user already exists, skipping creation.');
        }
    }
}
