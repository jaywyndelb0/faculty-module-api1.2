<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

class SectionFactory extends Factory
{
    public function definition(): array
    {
        return [
            'section_name' => $this->faker->word,
            'faculty_id' => null,
        ];
    }
}
