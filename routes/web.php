<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'status' => 'online',
        'message' => 'Faculty Module API is running successfully',
        'environment' => app()->environment(),
        'timestamp' => now()->toDateTimeString()
    ]);
});

Route::get('/test-api', function () {
    return view('test-api');
});
