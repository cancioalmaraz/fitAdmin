<?php

namespace App\Repositories;

use App\Models\Schedule;

class ScheduleRepository {
        
    /**
     * getBydId
     *
     * @param  int $id
     * @return Schedule
     */
    public function getById($id){
        return Schedule::find($id);
    }

    /**
     * queryAll
     *
     * @param  array $filterList
     * @return Builder
     */
    public function queryAll($filterList = []){
        $query = Schedule::from(Schedule::getFullTableName() . ' as sc')
            ->select('sc.*');

        return $query;
    }
    
    /**
     * getAll
     *
     * @param  int $limit
     * @param  int $offset
     * @param  array $order
     * @param  array $filterList
     * @return Schedule[]
     */
    public function getAll( $limit = 10,
                            $offset = 0,
                            $order = [['col' => 'sc.entry_time', 'dir' => 'asc']],
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