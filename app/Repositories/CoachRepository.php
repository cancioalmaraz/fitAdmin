<?php

namespace App\Repositories;

use App\Models\Coach;

class CoachRepository {
        
    /**
     * getBydId
     *
     * @param  int $id
     * @return Coach
     */
    public function getById($id){
        return Coach::find($id);
    }

    /**
     * queryAll
     *
     * @param  array $filterList
     * @return Builder
     */
    public function queryAll($filterList = []){
        $query = Coach::from(Coach::getFullTableName() . ' as ch')
            ->select('ch.*');

        if (array_key_exists('first_last_name', $filterList) ){
            $query->where('ch.first_last_name', 'like', '%'.$filterList['first_last_name'].'%');
        }

        if (array_key_exists('ci', $filterList) ){
            $query->where('ch.ci', '=', $filterList['ci']);
        }

        if (array_key_exists('searchText', $filterList) ){
            $query->where(function($query) use($filterList) {
                $query
                    ->orWhere('ch.name', 'like', "%" . $filterList['searchText'] . "%")
                    ->orWhere('ch.first_last_name', 'like', "%" . $filterList['searchText'] . "%")
                    ->orWhere('ch.second_last_name', 'like', "%" . $filterList['searchText'] . "%");
            });
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
     * @return Coach[]
     */
    public function getAll( $limit = 10,
                            $offset = 0,
                            $order = [['col' => 'ch.first_last_name', 'dir' => 'asc']],
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