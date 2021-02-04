<?php

namespace App\Repositories;

use App\Models\Membership;

class MembershipRepository {
    
    /**
     * queryAll
     *
     * @param  array $filterList
     * @return Builder
     */
    public function queryAll($filterList = []){
        $query = Membership::from(Membership::getFullTableName() . ' as m')
            ->select('m.*');

        if (array_key_exists('name', $filterList) ){
            $query->where('m.name', 'like', '%'.$filterList['name'].'%');
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
     * @return Membership[]
     */
    public function getAll( $limit = 10,
                            $offset = 0,
                            $order = [['col' => 'm.name', 'dir' => 'asc']],
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