<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'status',
        'assigned_to',
        'created_by',
        'manager_id',
    ];
    public function assigne()
    {
        return $this->belongsTo(User::class, 'assigned_to');
    }
    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
    public function manager()
{
    return $this->belongsTo(User::class, 'manager_id');
}
}
