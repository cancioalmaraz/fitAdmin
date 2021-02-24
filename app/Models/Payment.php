<?php

namespace App\Models;

use App\Models\BaseModel;

class Payment extends BaseModel
{
    public function clients(){
        return $this->belongsToMany(Client::class, 'clients_payments', 'client_id', 'payment_id');
    }

    public function toArray()
    {
        $array = parent::toArray();

        if (!is_null($this->clients)) {
            $array['clients'] = $this->clients();
        }

        return $array;
    }
}
