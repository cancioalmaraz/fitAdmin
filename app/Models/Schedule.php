<?php

namespace App\Models;

use App\Models\BaseModel;
use Illuminate\Support\Carbon;

class Schedule extends BaseModel
{
    //

    public function toArray()
    {
        $array = parent::toArray();

        $array['fullTime'] = Carbon::parse($this->entry_time)->format('H:i') . " - " . Carbon::parse($this->departure_time)->format('H:i');
        return $array;
    }
}
