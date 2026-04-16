<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    public function index()
    {
        \Illuminate\Support\Facades\Log::info('Fetching all students...');
        $students = DB::table('students')
            ->leftJoin('sections', 'students.section_id', '=', 'sections.id')
            ->select('students.*', 'sections.section_name')
            ->get();
        
        \Illuminate\Support\Facades\Log::info('Students found: ' . count($students));

        return response()->json($students, 200);
    }

    public function store(Request $request)
    {
        \Illuminate\Support\Facades\Log::info('Store Student Request:', $request->all());

        // Manual input cleanup
        $name = $request->input('name');
        $email = $request->input('email');
        $sectionId = $request->input('section_id');
        $source = $request->input('source', 'local');
        $externalId = $request->input('external_id');

        // Prevent duplicates for external students
        if ($source !== 'local' && $externalId) {
            $existing = DB::table('students')
                ->where('source', $source)
                ->where('external_id', $externalId)
                ->first();
            
            if ($existing) {
                return response()->json([
                    'status' => 200,
                    'success' => true,
                    'message' => 'Student already exists',
                    'data' => $existing
                ], 200);
            }
        }

        // Also check by email to prevent duplicates if email is provided
        if ($email) {
            $existingByEmail = DB::table('students')->where('email', $email)->first();
            if ($existingByEmail) {
                return response()->json([
                    'status' => 200,
                    'success' => true,
                    'message' => 'Student with this email already exists',
                    'data' => $existingByEmail
                ], 200);
            }
        }

        $validator = Validator::make([
            'name' => $name,
            'email' => $email,
            'section_id' => $sectionId,
        ], [
            'name' => 'required|string|max:100',
            'email' => 'nullable|email|max:100',
            'section_id' => 'nullable',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 400,
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 400);
        }

        try {
            // Robust Section Mapping
            $finalSectionId = null;
            if ($sectionId && is_numeric($sectionId)) {
                $exists = DB::table('sections')->where('id', (int)$sectionId)->exists();
                if ($exists) {
                    $finalSectionId = (int)$sectionId;
                }
            }

            if (!$finalSectionId) {
                $fallback = DB::table('sections')->first();
                if (!$fallback) {
                    throw new \Exception("No local sections found. Fallback failed.");
                }
                $finalSectionId = $fallback->id;
            }

            $id = DB::table('students')->insertGetId([
                'name' => $name,
                'email' => $email,
                'section_id' => $finalSectionId,
                'source' => $source,
                'external_id' => $externalId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            $student = DB::table('students')
                ->leftJoin('sections', 'students.section_id', '=', 'sections.id')
                ->where('students.id', $id)
                ->select('students.*', 'sections.section_name')
                ->first();

            return response()->json([
                'status' => 201,
                'success' => true,
                'message' => 'Student created successfully',
                'data' => $student
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 500,
                'success' => false,
                'message' => 'Failed to create student: ' . $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $student = DB::table('students')
            ->leftJoin('sections', 'students.section_id', '=', 'sections.id')
            ->where('students.id', $id)
            ->select('students.*', 'sections.section_name')
            ->first();

        if (!$student) {
            return response()->json(['status' => 404, 'message' => 'Student not found'], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Student details retrieved successfully',
            'data' => $student
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $name = $request->input('name');
        $email = $request->input('email');
        $sectionId = $request->input('section_id');

        $validator = Validator::make([
            'name' => $name,
            'email' => $email,
            'section_id' => $sectionId,
        ], [
            'name' => 'sometimes|required|string|max:100',
            'email' => 'sometimes|nullable|email|max:100',
            'section_id' => 'sometimes|nullable',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Handle section mapping if provided
        if ($request->has('section_id')) {
            $finalSectionId = null;
            if ($sectionId && is_numeric($sectionId)) {
                $exists = DB::table('sections')->where('id', (int)$sectionId)->exists();
                if ($exists) {
                    $finalSectionId = (int)$sectionId;
                }
            }

            if (!$finalSectionId) {
                $fallback = DB::table('sections')->first();
                $finalSectionId = $fallback ? $fallback->id : null;
            }
        }

        $data = [];
        if ($request->has('name')) $data['name'] = $name;
        if ($request->has('email')) $data['email'] = $email;
        if ($request->has('section_id')) $data['section_id'] = $finalSectionId;
        $data['updated_at'] = now();

        DB::table('students')
            ->where('id', $id)
            ->update($data);

        $student = DB::table('students')
            ->leftJoin('sections', 'students.section_id', '=', 'sections.id')
            ->where('students.id', $id)
            ->select('students.*', 'sections.section_name')
            ->first();

        return response()->json([
            'status' => 200,
            'message' => 'Student updated successfully',
            'data' => $student
        ], 200);
    }

    public function destroy($id)
    {
        $affected = DB::table('students')->where('id', $id)->delete();

        if ($affected === 0) {
            return response()->json(['status' => 404, 'message' => 'Student not found'], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Student deleted successfully'
        ], 200);
    }
}
