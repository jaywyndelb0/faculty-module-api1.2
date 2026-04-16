<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class FacultyController extends Controller
{
    public function index()
    {
        $faculty = DB::table('faculty')->get();

        return response()->json($faculty, 200);
    }

    public function show($id)
    {
        $faculty = DB::table('faculty')->where('id', $id)->first();

        if (!$faculty) {
            return response()->json(['status' => 404, 'message' => 'Faculty record not found'], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Faculty record retrieved successfully',
            'data' => $faculty
        ], 200);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:100',
            'department' => 'required|string|max:100',
            'subject_id' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $id = DB::table('faculty')->insertGetId([
            'name' => $request->name,
            'email' => $request->email,
            'department' => $request->department,
            'subject_id' => $request->subject_id,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $faculty = DB::table('faculty')->where('id', $id)->first();

        return response()->json([
            'status' => 201,
            'success' => true,
            'message' => 'Faculty created successfully',
            'data' => $faculty
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:100',
            'email' => 'sometimes|required|email|max:100',
            'department' => 'sometimes|required|string|max:100',
            'subject_id' => 'nullable|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $data = $request->only(['name', 'email', 'department', 'subject_id']);
        $data['updated_at'] = now();

        $affected = DB::table('faculty')
            ->where('id', $id)
            ->update($data);

        $faculty = DB::table('faculty')->where('id', $id)->first();

        return response()->json([
            'status' => 200,
            'success' => true,
            'message' => 'Faculty record updated successfully',
            'data' => $faculty
        ], 200);
    }

    public function destroy($id)
    {
        $affected = DB::table('faculty')->where('id', $id)->delete();

        if ($affected === 0) {
            return response()->json(['status' => 404, 'message' => 'Faculty record not found'], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Faculty record deleted successfully'
        ], 200);
    }

    public function getSchedule($id)
    {
        $faculty = DB::table('faculty')->where('id', $id)->first();

        if (!$faculty) {
            return response()->json(['status' => 404, 'message' => 'Faculty record not found'], 404);
        }

        $schedule = DB::table('sections')
            ->where('faculty_id', $id)
            ->select('id as section_id', 'section_name', 'schedule', 'room', 'created_at')
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'Faculty schedule retrieved successfully',
            'data' => [
                'faculty_name' => $faculty->name,
                'schedule' => $schedule
            ]
        ], 200);
    }

    public function getSectionFaculty($id)
    {
        $section = DB::table('sections')
            ->leftJoin('faculty', 'sections.faculty_id', '=', 'faculty.id')
            ->where('sections.id', $id)
            ->select('sections.id as section_id', 'sections.section_name', 'faculty.id as faculty_id', 'faculty.name as faculty_name')
            ->first();

        if (!$section) {
            return response()->json(['status' => 404, 'message' => 'Section not found'], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Section assignment details retrieved successfully',
            'data' => $section
        ], 200);
    }

    public function assignToSection(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'faculty_id' => 'required|integer|exists:faculty,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $affected = DB::table('sections')
            ->where('id', $id)
            ->update(['faculty_id' => $request->faculty_id, 'updated_at' => now()]);

        if ($affected === 0) {
            return response()->json(['status' => 404, 'message' => 'Section not found'], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Faculty assigned to section successfully'
        ], 200);
    }

    public function assignToSectionGeneral(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'faculty_id' => 'required|integer|exists:faculty,id',
            'section_id' => 'required|integer',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $affected = DB::table('sections')
            ->where('id', $request->section_id)
            ->update(['faculty_id' => $request->faculty_id, 'updated_at' => now()]);

        if ($affected === 0) {
            return response()->json(['status' => 404, 'message' => 'Section not found'], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Faculty assigned to section successfully'
        ], 200);
    }

    public function removeFacultyFromSection($id)
    {
        $affected = DB::table('sections')
            ->where('id', $id)
            ->update(['faculty_id' => null, 'updated_at' => now()]);

        if ($affected === 0) {
            $section = DB::table('sections')->where('id', $id)->first();
            if (!$section) {
                return response()->json(['status' => 404, 'message' => 'Section not found'], 404);
            }
            return response()->json(['status' => 200, 'message' => 'No faculty was assigned to this section'], 200);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Faculty removed from section successfully'
        ], 200);
    }

    public function getClasslist($id)
    {
        $section = DB::table('sections')->where('id', $id)->first();

        if (!$section) {
            return response()->json(['status' => 404, 'message' => 'Section not found'], 404);
        }

        $students = DB::table('students')->where('section_id', $id)->get(['id', 'name']);

        return response()->json([
            'status' => 200,
            'message' => 'Class list retrieved successfully',
            'data' => [
                'section_name' => $section->section_name,
                'students' => $students
            ]
        ], 200);
    }

    public function indexGrades()
    {
        $grades = DB::table('grades')
            ->join('students', 'grades.student_id', '=', 'students.id')
            ->select('grades.id', 'students.name as student_name', 'grades.subject', 'grades.grade', 'grades.created_at')
            ->get();

        return response()->json($grades, 200);
    }

    public function uploadGrade(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|integer|exists:students,id',
            'subject' => 'required|string|max:100',
            'grade' => 'required|string|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $id = DB::table('grades')->insertGetId([
            'student_id' => $request->student_id,
            'subject' => $request->subject,
            'grade' => $request->grade,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $grade = DB::table('grades')
            ->join('students', 'grades.student_id', '=', 'students.id')
            ->where('grades.id', $id)
            ->select('grades.id', 'students.name as student_name', 'grades.subject', 'grades.grade', 'grades.created_at')
            ->first();

        return response()->json([
            'status' => 201,
            'success' => true,
            'message' => 'Grade uploaded successfully',
            'data' => $grade
        ], 201);
    }

    public function updateGrade(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'subject' => 'sometimes|required|string|max:100',
            'grade' => 'sometimes|required|string|max:5',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $affected = DB::table('grades')
            ->where('id', $id)
            ->update(array_merge($request->only(['subject', 'grade']), ['updated_at' => now()]));

        $grade = DB::table('grades')
            ->join('students', 'grades.student_id', '=', 'students.id')
            ->where('grades.id', $id)
            ->select('grades.id', 'students.name as student_name', 'grades.subject', 'grades.grade', 'grades.created_at')
            ->first();

        return response()->json([
            'status' => 200,
            'message' => 'Grade record updated successfully',
            'data' => $grade
        ], 200);
    }

    public function deleteGrade($id)
    {
        $affected = DB::table('grades')->where('id', $id)->delete();

        if ($affected === 0) {
            return response()->json(['status' => 404, 'message' => 'Grade record not found'], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Grade record deleted successfully'
        ], 200);
    }

    public function getStudentGrades($studentId)
    {
        $student = DB::table('students')->where('id', $studentId)->first();

        if (!$student) {
            return response()->json(['status' => 404, 'message' => 'Student not found'], 404);
        }

        $grades = DB::table('grades')->where('student_id', $studentId)->get(['id', 'subject', 'grade']);

        return response()->json([
            'status' => 200,
            'message' => 'Grades retrieved successfully',
            'data' => [
                'student_name' => $student->name,
                'grades' => $grades
            ]
        ], 200);
    }

    public function getSubjects()
    {
        $subjects = DB::table('subjects')->get();

        return response()->json([
            'status' => 200,
            'message' => 'Subjects retrieved successfully',
            'data' => $subjects
        ], 200);
    }

    public function recordAttendance(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'student_id' => 'required|integer|exists:students,id',
            'date' => 'required|date',
            'status' => 'required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        // Check for duplicate: student_id + date
        $exists = DB::table('attendance')
            ->where('student_id', $request->student_id)
            ->whereDate('date', $request->date)
            ->exists();

        if ($exists) {
            return response()->json([
                'status' => 409,
                'message' => 'Attendance already recorded for this student on the selected date.'
            ], 409);
        }

        $id = DB::table('attendance')->insertGetId([
            'student_id' => $request->student_id,
            'date' => $request->date,
            'status' => $request->status,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $attendance = DB::table('attendance')->where('id', $id)->first();

        return response()->json([
            'status' => 201,
            'success' => true,
            'message' => 'Attendance recorded successfully',
            'data' => $attendance
        ], 201);
    }

    public function updateAttendance(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'sometimes|required|date',
            'status' => 'sometimes|required|string|max:20',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 400);
        }

        $affected = DB::table('attendance')
            ->where('id', $id)
            ->update(array_merge($request->only(['date', 'status']), ['updated_at' => now()]));

        $attendance = DB::table('attendance')->where('id', $id)->first();

        return response()->json([
            'status' => 200,
            'message' => 'Attendance record updated successfully',
            'data' => $attendance
        ], 200);
    }

    public function deleteAttendance($id)
    {
        $affected = DB::table('attendance')->where('id', $id)->delete();

        if ($affected === 0) {
            return response()->json(['status' => 404, 'message' => 'Attendance record not found'], 404);
        }

        return response()->json([
            'status' => 200,
            'message' => 'Attendance record deleted successfully'
        ], 200);
    }

    public function getAttendance($studentId)
    {
        $student = DB::table('students')->where('id', $studentId)->first();

        if (!$student) {
            return response()->json(['status' => 404, 'message' => 'Student not found'], 404);
        }

        $attendance = DB::table('attendance')
            ->where('student_id', $studentId)
            ->orderBy('date', 'desc')
            ->get();

        return response()->json([
            'status' => 200,
            'message' => 'Attendance retrieved successfully',
            'data' => $attendance
        ], 200);
    }

    public function syncSubjects(Request $request)
    {
        $subjects = $request->input('subjects', []);
        $syncedIds = [];
        $syncedCount = 0;

        foreach ($subjects as $subjectData) {
            $externalId = $subjectData['id'];
            $syncedIds[] = $externalId;
            
            DB::table('subjects')->updateOrInsert(
                ['id' => $externalId],
                [
                    'code' => $subjectData['subject_code'] ?? $subjectData['code'] ?? 'N/A',
                    'name' => $subjectData['subject_name'] ?? $subjectData['name'] ?? 'Unknown Subject',
                    'updated_at' => now(),
                    'created_at' => DB::raw('IFNULL(created_at, "' . now() . '")')
                ]
            );
            $syncedCount++;
        }

        // Remove old/test subjects not present in the Registrar sync list
        if (!empty($syncedIds)) {
            DB::table('subjects')->whereNotIn('id', $syncedIds)->delete();
        }

        return response()->json([
            'status' => 200,
            'message' => "Successfully synced {$syncedCount} subjects from Registrar Module. Local database is now the single source of truth."
        ], 200);
    }
}
