<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class SchoolSystemSeeder extends Seeder
{
    public function run(): void
    {
        DB::table('users')->insert([
            'name' => 'Admin Staff',
            'email' => 'admin@school.edu',
            'password' => Hash::make('password123'),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        DB::table('faculty')->insert([
            ['name' => 'Juan Dela Cruz', 'email' => 'juan@school.edu', 'department' => 'IT Department', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Maria Clara', 'email' => 'maria@school.edu', 'department' => 'Education', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Jose Rizal', 'email' => 'jose@school.edu', 'department' => 'Business Admin', 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('sections')->insert([
            ['section_name' => 'BSIT-1A', 'faculty_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['section_name' => 'BEED-2B', 'faculty_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['section_name' => 'BSBA-3C', 'faculty_id' => 3, 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('students')->insert([
            ['name' => 'Cardo Dalisay', 'section_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Niana Guerrero', 'section_id' => 1, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Liza Soberano', 'section_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Kathryn Bernardo', 'section_id' => 2, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Daniel Padilla', 'section_id' => 3, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Enrique Gil', 'section_id' => 3, 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('grades')->insert([
            ['student_id' => 1, 'subject' => 'Web Development', 'grade' => '1.25', 'created_at' => now(), 'updated_at' => now()],
            ['student_id' => 2, 'subject' => 'Database Systems', 'grade' => '1.50', 'created_at' => now(), 'updated_at' => now()],
            ['student_id' => 3, 'subject' => 'Teaching Principles', 'grade' => '1.75', 'created_at' => now(), 'updated_at' => now()],
            ['student_id' => 5, 'subject' => 'Marketing Management', 'grade' => '2.00', 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('attendance')->insert([
            ['student_id' => 1, 'date' => '2026-03-06', 'status' => 'present', 'created_at' => now(), 'updated_at' => now()],
            ['student_id' => 2, 'date' => '2026-03-06', 'status' => 'present', 'created_at' => now(), 'updated_at' => now()],
            ['student_id' => 3, 'date' => '2026-03-06', 'status' => 'absent', 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('subjects')->insert([
            ['name' => 'Web Development', 'code' => 'IT101', 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Database Systems', 'code' => 'IT102', 'created_at' => now(), 'updated_at' => now()],
        ]);

        DB::table('schedules')->insert([
            ['subject_id' => 1, 'section_id' => 1, 'day' => 'Monday', 'start_time' => '08:00:00', 'end_time' => '10:00:00', 'created_at' => now(), 'updated_at' => now()],
            ['subject_id' => 2, 'section_id' => 1, 'day' => 'Wednesday', 'start_time' => '10:00:00', 'end_time' => '12:00:00', 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
