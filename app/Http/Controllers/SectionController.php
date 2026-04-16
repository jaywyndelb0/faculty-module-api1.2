<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class SectionController extends Controller
{
    public function index()
    {
        $sections = DB::table('sections')
            ->leftJoin('faculty', 'sections.faculty_id', '=', 'faculty.id')
            ->select('sections.*', 'faculty.name as faculty_name')
            ->get();

        return response()->json($sections, 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'section_name' => 'required|string|max:100',
            'faculty_id' => 'nullable|integer|exists:faculty,id',
            'schedule' => 'nullable|string|max:100',
            'room' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $id = DB::table('sections')->insertGetId([
            'section_name' => $request->section_name,
            'faculty_id' => $request->faculty_id,
            'schedule' => $request->schedule,
            'room' => $request->room,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return response()->json([
            'status' => 201,
            'message' => 'Section created successfully',
            'data' => [
                'id' => $id, 
                'section_name' => $request->section_name,
                'schedule' => $request->schedule,
                'room' => $request->room
            ]
        ], 201);
    }

    public function show($id)
    {
        $section = DB::table('sections')
            ->leftJoin('faculty', 'sections.faculty_id', '=', 'faculty.id')
            ->where('sections.id', $id)
            ->select('sections.*', 'faculty.name as faculty_name')
            ->first();

        if (!$section) {
            return response()->json(['status' => 404, 'message' => 'Section not found'], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Section details retrieved successfully',
            'data' => $section
        ], 200);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'section_name' => 'sometimes|required|string|max:100',
            'faculty_id' => 'nullable|integer|exists:faculty,id',
            'schedule' => 'nullable|string|max:100',
            'room' => 'nullable|string|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $affected = DB::table('sections')
            ->where('id', $id)
            ->update(array_merge($request->only(['section_name', 'faculty_id', 'schedule', 'room']), ['updated_at' => now()]));

        if ($affected === 0) {
            return response()->json(['status' => 404, 'message' => 'Section not found or no changes made'], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Section updated successfully'
        ], 200);
    }

    public function destroy($id)
    {
        $affected = DB::table('sections')->where('id', $id)->delete();

        if ($affected === 0) {
            return response()->json(['status' => 404, 'message' => 'Section not found'], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Section deleted successfully'
        ], 200);
    }

    public function syncSections(Request $request)
    {
        $sections = $request->input('sections', []);
        $syncedIds = [];
        $syncedCount = 0;

        foreach ($sections as $sectionData) {
            $externalId = $sectionData['id'];
            $syncedIds[] = $externalId;
            
            DB::table('sections')->updateOrInsert(
                ['id' => $externalId],
                [
                    'section_name' => $sectionData['section_name'] ?? $sectionData['name'] ?? 'Unnamed Section',
                    'schedule' => $sectionData['schedule'] ?? null,
                    'room' => $sectionData['room'] ?? null,
                    'updated_at' => now(),
                    'created_at' => DB::raw('IFNULL(created_at, "' . now() . '")')
                ]
            );
            $syncedCount++;
        }

        // Remove old/test sections not present in the Registrar sync list
        if (!empty($syncedIds)) {
            DB::table('sections')->whereNotIn('id', $syncedIds)->delete();
        }

        return response()->json([
            'status' => 200,
            'message' => "Successfully synced {$syncedCount} sections from Registrar Module. Local database is now the single source of truth."
        ], 200);
    }
}
