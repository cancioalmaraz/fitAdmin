<?php

namespace App\Models;

use App\Models\BaseModel;

class Schedule extends BaseModel
{
    //

    public function toArray()
    {
        $array = parent::toArray();

        $array['fullTime'] = $this->entry_time . " - " . $this->departure_time;

        return $array;
    }
}
