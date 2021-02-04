<?php

namespace App\Models;

class Coach extends BaseModel
{
    protected $casts = [
        'address' => 'array'
    ];
}
