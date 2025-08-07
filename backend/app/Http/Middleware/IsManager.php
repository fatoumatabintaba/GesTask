<?php
namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class IsManager
{
    public function handle(Request $request, Closure $next)
    {
        if ($request->user() && $request->user()->role === 'manager') {
            return $next($request);
        }
        return response()->json(['error' => 'Forbidden'], 403);
    }
}