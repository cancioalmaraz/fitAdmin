<?php

namespace App\Models;

use App\Models\BaseModel;
use DateTime;
use Illuminate\Support\Facades\Date;

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

    public function payments(){
        return $this->belongsToMany(Payment::class, 'clients_payments', 'client_id', 'payment_id')->latest();
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

        $endDate = new DateTime($this->payments()->latest()->first()->end_date);
        $today = new DateTime(date("Y-m-d"));

        $diff = $endDate->diff($today);
        $array['remaining_days'] = $diff->days;
        $array['last_payment'] = $this->payments()->latest()->first();

        return $array;
    }
}
