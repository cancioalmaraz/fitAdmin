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

        //TODO: Make it dynamic with hours offset from client (its only valid to gmt -4)
        $array['fullTime'] = Carbon::parse($this->entry_time)->addHours(-4)->format('H:i') . " - " . Carbon::parse($this->departure_time)->addHours(-4)->format('H:i');
        return $array;
    }
}
