<?php

namespace App\Repositories;

use App\Models\Client;
use App\Models\Payment;
use Illuminate\Database\Eloquent\Builder;

class PaymentRepository {
    
    /**
     * getBydId
     *
     * @param  int $id
     * @return Payment
     */
    public function getById($id){
        return Payment::find($id);
    }

    /**
     * queryAll
     *
     * @param  array $filterList
     * @return Builder
     */
    public function queryAll($filterList = []){
        $query = Payment::from(Payment::getFullTableName() . ' as pm')
            ->select('pm.*');

        if (array_key_exists('client', $filterList) ){
            $query->join('client_payment as cp', 'cp.payment_id', '=', 'pm.id');
            $query->join(Client::getFullTableName() . ' as c', 'cp.client_id', '=', 'c.id');
            $query->where('c.id', '=', $filterList['client']);
        }

        return $query;
    }
    
    /**
     * getAll
     *
     * @param  int $limit
     * @param  int $offset
     * @param  array $order
     * @param  array $filterList
     * @return Payment[]
     */
    public function getAll( $limit = 10,
                            $offset = 0,
                            $order = [['col' => 'pm.created_at', 'dir' => 'asc']],
                            $filterList = [] ){
        $query = $this->queryAll($filterList);

        $query->take($limit)->skip($offset);
        foreach($order as $orderItem) {
            $query->orderBy($orderItem['col'], $orderItem['dir']);
        }

        return $query->get();
    }
    
    /**
     * countAll
     *
     * @return int
     */
    public function countAll(){
        $query = $this->queryAll();
        return $query->count();
    }
    
    /**
     * countAllFiltered
     *
     * @param  array $filterList
     * @return int
     */
    public function countAllFiltered($filterList = []){
        $query = $this->queryAll($filterList);
        return $query->count();
    }

}