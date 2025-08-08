<?php

namespace App\Http\Controllers\Api;
use App\Models\User;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Notifications\TaskAssignedNotification;
use App\Models\Task;

class TaskController extends Controller
{
    /**
     * Display all tasks (with relations).
     */
    public function index()
    {
        return Task::with(['creator', 'assignee'])->get();
    }

    /**
     * Display a listing of the manager's tasks.
     */
    public function managerTasks()
    {
        return Task::all();
    }

    /**
     * Store a newly created task by the manager.
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required',
            'assigned_to' => 'required|exists:users,id'
        ]);

        $task = Task::create([
            'title' => $request->title,
            'description' => $request->description,
            'assigned_to' => $request->assigned_to,
            'created_by' => $request->user()->id,
            'status' => 'pending',
        ]);
           $employee = User::find($task->assigned_to);
        // $employee = User::find($task->employee_id);
        $employee->notify(new TaskAssignedNotification($task));

        return response()->json($task, 201);
    }

    /**
     * Display the specified task.
     */
    public function show($id)
    {
        $task = Task::findOrFail($id);
        return $task->load(['creator', 'assignee']);
    }

    /**
     * Update the specified task.
     */
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);
        $task->update($request->all());
        return response()->json($task);
    }

    /**
     * Remove the specified task.
     */
    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();
        return response()->json(['message' => 'Tâche supprimée']);
    }

    /**
     * Mark the specified task as complete.
     */
public function complete($id)
{
    $task = Task::findOrFail($id);
    $task->completed = true;
    $task->save();

    // Récupère le manager (créateur de la tâche)
    $manager = User::find($task->created_by);

    // Notifie le manager
    $manager->notify(new TaskCompletedNotification($task, Auth::user()));

    return response()->json(['message' => 'Tâche marquée comme terminée.']);
}


}
