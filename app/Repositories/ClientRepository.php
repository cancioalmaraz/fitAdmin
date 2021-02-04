<?php

namespace App\Repositories;

use App\Models\Client;

class ClientRepository {
        
    /**
     * getById
     *
     * @param  int $id
     * @return Client
     */
    public function getById($id){
        return Client::find($id);
    }

    /**
     * queryAll
     *
     * @param  array $filterList
     * @return Builder
     */
    public function queryAll($filterList = []){
        $query = Client::from(Client::getFullTableName() . ' as c')
            ->select('c.*');

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
                            $order = [['col' => 'c.first_last_name', 'dir' => 'asc']],
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