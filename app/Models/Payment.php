<?php

namespace App\Models;

use App\Models\BaseModel;

class Payment extends BaseModel
{
    public function clients(){
        return $this->belongsToMany(Client::class, 'client_payment', 'payment_id', 'client_id');
    }

    public function toArray()
    {
        $array = parent::toArray();

        $array['clients'] = $this->clients;

        return $array;
    }
}
