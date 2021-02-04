<?php

namespace App\Models;

use App\Models\BaseModel;
class Client extends BaseModel
{
    protected $table = 'clients';

    protected $casts = [
        'address' => 'array'
    ];
}
