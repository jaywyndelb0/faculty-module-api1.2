<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\Faculty;
use App\Models\Section;
use App\Models\Student;
use App\Models\Subject;

class FacultyModuleTest extends TestCase
{
    use RefreshDatabase;

    public function test_can_create_faculty()
    {
        $response = $this->postJson('/api/faculty', [
            'name' => 'Test Faculty',
            'email' => 'test.faculty@example.com',
            'department' => 'Testing',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'id',
                    'name',
                ],
            ]);
    }

    public function test_can_assign_faculty_to_section()
    {
        $faculty = Faculty::factory()->create();
        $section = Section::factory()->create();

        $response = $this->postJson("/api/sections/{$section->id}/assign-faculty", [
            'faculty_id' => $faculty->id,
        ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 200,
                'message' => 'Faculty assigned to section successfully',
            ]);
    }

    public function test_can_get_classlist()
    {
        $section = Section::factory()->create();
        Student::factory()->count(3)->create(['section_id' => $section->id]);

        $response = $this->getJson("/api/sections/{$section->id}/classlist");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'section_name',
                    'students' => [
                        '*' => [
                            'id',
                            'name',
                        ],
                    ],
                ],
            ]);
    }

    public function test_can_upload_grade()
    {
        $student = Student::factory()->create();

        $response = $this->postJson('/api/grades', [
            'student_id' => $student->id,
            'subject' => 'Math',
            'grade' => 'A',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'id',
                ],
            ]);
    }

    public function test_can_get_student_grades()
    {
        $student = Student::factory()->create();

        $response = $this->getJson("/api/grades/{$student->id}");

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'student_name',
                    'grades',
                ],
            ]);
    }

    public function test_can_record_attendance()
    {
        $student = Student::factory()->create();

        $response = $this->postJson('/api/attendance', [
            'student_id' => $student->id,
            'date' => '2026-03-06',
            'status' => 'present',
        ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'id',
                ],
            ]);
    }
}
