<?php

namespace App\Models;

use App\Models\BaseModel;
class Client extends BaseModel
{
    protected $table = 'clients';

    protected $casts = [
        'address' => 'array'
    ];

    public function coach(){
        return $this->belongsTo(Coach::class, 'coach_id', 'id');
    }

    public function membership(){
        return $this->belongsTo(Membership::class, 'membership_id', 'id');
    }

    public function schedule(){
        return $this->belongsTo(Schedule::class, 'schedule_id', 'id');
    }

    public function toArray()
    {
        $array = parent::toArray();

        if (!is_null($this->coach)) {
            $array['coach'] = $this->coach;
        }

        if (!is_null($this->membership)) {
            $array['membership'] = $this->membership;
        }

        if (!is_null($this->schedule)) {
            $array['schedule'] = $this->schedule;
        }

        return $array;
    }
}
