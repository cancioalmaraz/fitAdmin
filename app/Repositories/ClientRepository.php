<?php

namespace App\Repositories;

use App\Models\Client;
use Illuminate\Support\Facades\DB;

class ClientRepository {
        
    /**
     * getById
     *
     * @param  int $id
     * @return Client
     */
    public function getById($id){
        $query = $this->queryAll()
            ->where('c.id', '=', $id);

        return $query->first();
    }

    /**
     * queryAll
     *
     * @param  array $filterList
     * @return Builder
     */
    public function queryAll($filterList = []){
        $query = Client::from(Client::getFullTableName() . ' as c')
            ->select('c.*')
            ->addSelect(DB::raw("(SELECT DATEDIFF(pm.end_date, CURRENT_DATE())
                                FROM fitAdmin.clients as c2
                                INNER JOIN fitAdmin.client_payment as cp
                                ON c2.id = cp.client_id
                                INNER JOIN fitAdmin.payments as pm
                                ON pm.id = cp.payment_id
                                WHERE c2.id = c.id
                                ORDER BY pm.created_at DESC LIMIT 1) as remaining_days"))
            ->addSelect(DB::raw("FLOOR(DATEDIFF(CURRENT_DATE(), c.date_of_birth) / 365.25) as age"));

        if (array_key_exists('first_last_name', $filterList) ){
            $query->where('c.first_last_name', 'like', '%'.$filterList['first_last_name'].'%');
        }

        if (array_key_exists('ci', $filterList) ){
            $query->where('c.ci', '=', $filterList['ci']);
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
     * @return Client[]
     */
    public function getAll( $limit = 10,
                            $offset = 0,
                            $order = [['col' => 'remaining_days', 'dir' => 'asc']],
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