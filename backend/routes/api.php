<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\TaskController;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Mail;
use App\Notifications\UserRegistered;


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

Route::post('/send-email', function (Request $request) {
    $data = $request->validate([
        'to' => 'required|email',
        'subject' => 'required|string',
        'message' => 'required|string',
    ]);

    Mail::raw($data['message'], function ($message) use ($data) {
        $message->to($data['to'])
                ->subject($data['subject']);
    });

    return response()->json(['message' => 'Email envoyé avec succès']);
});

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
        Route::put('/tasks/{id}/complete', [TaskController::class, 'complete']);
    });
});


Route::middleware(['auth:sanctum', 'role:admin,manager'])->get('/dashboard', function () {
    return response()->json(['message' => 'Bienvenue sur le dashboard']);
});

// Liste des utilisateurs pour admin
Route::middleware(['auth:sanctum', 'role:admin'])->get('/users', [UserController::class, 'index']);

// Liste des tâches du manager
Route::middleware(['auth:sanctum', 'is_manager'])->get('/manager-tasks', [TaskController::class, 'managerTasks']);

// Liste des employés
Route::middleware(['auth:sanctum', 'is_manager'])->get('/employees', [UserController::class, 'employees']);

// Assigner une tâche à un employé
Route::middleware(['auth:sanctum', 'is_manager'])->post('/tasks', [TaskController::class, 'store']);

// Marquer une tâche comme terminée
// Route::middleware(['auth:sanctum'])->put('/tasks/{id}/complete', [TaskController::class, 'markAsComplete']);





