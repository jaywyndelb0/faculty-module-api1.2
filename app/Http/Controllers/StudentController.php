<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    public function index()
    {
        $students = DB::table('students')
            ->leftJoin('sections', 'students.section_id', '=', 'sections.id')
            ->select('students.*', 'sections.section_name')
            ->get();

        return response()->json($students, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'section_id' => 'required|integer|exists:sections,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $id = DB::table('students')->insertGetId([
            'name' => $request->name,
            'section_id' => $request->section_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'status' => 201,
            'message' => 'Student created successfully',
            'data' => ['id' => $id, 'name' => $request->name]
        ], 201);
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
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:100',
            'section_id' => 'sometimes|required|integer|exists:sections,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $affected = DB::table('students')
            ->where('id', $id)
            ->update(array_merge($request->only(['name', 'section_id']), ['updated_at' => now()]));

        if ($affected === 0) {
            return response()->json(['status' => 404, 'message' => 'Student not found or no changes made'], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Student updated successfully'
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
