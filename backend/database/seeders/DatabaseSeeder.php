<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Call the DefaultUserSeeder to create the default user
        $this->call([
            DefaultUserSeeder::class,
        ]);

        // Uncomment to create additional test users
        // User::factory(10)->create();
    }
}
