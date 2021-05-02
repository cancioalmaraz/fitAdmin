<?php

namespace App\Models;

use App\Models\BaseModel;

class Payment extends BaseModel
{
    public function clients(){
        return $this->belongsToMany(Client::class, 'client_payment', 'payment_id', 'client_id');
    }

    public function coach(){
        return $this->belongsTo(Coach::class, 'coach_id', 'id');
    }

    public function toArray()
    {
        $array = parent::toArray();

        $array['clients'] = $this->clients;


        if (!is_null($this->coach)) {
            $array['coach'] = $this->coach;
        }

        return $array;
    }
}
