<?php

namespace App\Models;

class Coach extends BaseModel
{
    protected $casts = [
        'address' => 'array'
    ];

    public function toArray()
    {
        $array = parent::toArray();

        $array['fullName'] = $this->name . " " . $this->first_last_name . " " . $this->second_last_name;

        return $array;
    }
}
