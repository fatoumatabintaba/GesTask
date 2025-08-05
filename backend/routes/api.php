<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TaskController;


/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);

    Route::middleware('role:admin')->group(function () {
        Route::apiResource('users', UserController::class);
    });

    Route::middleware('role:admin,manager')->group(function () {
        Route::apiResource('tasks', TaskController::class);
    });

    Route::middleware('role:employee')->group(function () {
        Route::get('/my-tasks', function (Request $request) {
            return \App\Models\Task::where('assigned_to', $request->user()->id)->get();
        });
    });
});


Route::middleware(['auth:sanctum', 'role:admin,manager'])->get('/dashboard', function () {
    return response()->json(['message' => 'Bienvenue sur le dashboard']);
});

Route::middleware(['auth:sanctum', 'role:admin'])->get('/users', [UserController::class, 'index']);



