<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\SectionController;
use App\Http\Controllers\AuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::get('test', function () {
    return response()->json(['message' => 'API is working']);
});

Route::prefix('faculty')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
});

Route::middleware('auth:sanctum')->group(function () {
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/users', [AuthController::class, 'index']);

    Route::get('/faculty', [FacultyController::class, 'index']);
    Route::post('/faculty', [FacultyController::class, 'store']);
    Route::get('/faculty/{id}', [FacultyController::class, 'show']);
    Route::put('/faculty/{id}', [FacultyController::class, 'update']);
    Route::delete('/faculty/{id}', [FacultyController::class, 'destroy']);
    Route::get('/faculty/{id}/schedule', [FacultyController::class, 'getSchedule']);
    Route::post('/assign-faculty', [FacultyController::class, 'assignToSectionGeneral']);

    Route::get('/sections/{id}/faculty', [FacultyController::class, 'getSectionFaculty']);
    Route::post('/sections/{id}/assign-faculty', [FacultyController::class, 'assignToSection']);
    Route::delete('/sections/{id}/remove-faculty', [FacultyController::class, 'removeFacultyFromSection']);
    Route::get('/sections/{id}/classlist', [FacultyController::class, 'getClasslist']);

    Route::get('/grades', [FacultyController::class, 'indexGrades']);
    Route::post('/grades', [FacultyController::class, 'uploadGrade']);
    Route::put('/grades/{id}', [FacultyController::class, 'updateGrade']);
    Route::delete('/grades/{id}', [FacultyController::class, 'deleteGrade']);
    Route::get('/grades/{studentId}', [FacultyController::class, 'getStudentGrades']);

    Route::get('/subjects', [FacultyController::class, 'getSubjects']);

    Route::post('/attendance', [FacultyController::class, 'recordAttendance']);
    Route::put('/attendance/{id}', [FacultyController::class, 'updateAttendance']);
    Route::delete('/attendance/{id}', [FacultyController::class, 'deleteAttendance']);
    Route::get('/attendance/{studentId}', [FacultyController::class, 'getAttendance']);

    Route::apiResource('students', StudentController::class);
    Route::apiResource('sections', SectionController::class);
});
