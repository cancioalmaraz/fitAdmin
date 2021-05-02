<?php

namespace App\Repositories;

use App\Models\Client;
use App\Models\Coach;
use App\Models\Schedule;
use App\Models\Membership;
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

        if (array_key_exists('second_last_name', $filterList) ){
            $query->where('c.second_last_name', 'like', '%'.$filterList['second_last_name'].'%');
        }

        if (array_key_exists('sex', $filterList) ){
            $query->where('c.sex', '=', $filterList['sex']);
        }

        if (array_key_exists('searchText', $filterList) ){
            $query->where(function($query) use($filterList) {
                $query
                    ->orWhere('c.name', 'like', "%" . $filterList['searchText'] . "%")
                    ->orWhere('c.first_last_name', 'like', "%" . $filterList['searchText'] . "%")
                    ->orWhere('c.second_last_name', 'like', "%" . $filterList['searchText'] . "%");
            });
        }

        if (array_key_exists('birth_date', $filterList) ){
            $fieldRaw = "DATEDIFF(DATE_FORMAT(DATE_ADD(c.date_of_birth, INTERVAL (YEAR(CURRENT_DATE()) - YEAR(c.date_of_birth)) YEAR), '%Y-%m-%d'), CURRENT_DATE())";
            $query->addSelect(DB::raw($fieldRaw . ' as remaining_days_to_birthday'));
            if($filterList['birth_date'] == 'previous'){
                $query->whereRaw($fieldRaw . ' BETWEEN -7 AND -1');
            }
            if($filterList['birth_date'] == 'today'){
                $query->whereRaw($fieldRaw . ' = 0');
            }
            if($filterList['birth_date'] == 'tomorrow'){
                $query->whereRaw($fieldRaw . ' = 1');
            }
            if($filterList['birth_date'] == 'next'){
                $query->whereRaw($fieldRaw . ' BETWEEN 2 AND 7');
            }
        }

        if (array_key_exists('idList', $filterList) ){
            $query->whereIn('c.id', $filterList['idList']);
        }

        if (array_key_exists('ci', $filterList) ){
            $query->where('c.ci', '=', $filterList['ci']);
        }

        if (array_key_exists('coach', $filterList) ){
            $query->join(Coach::getFullTableName() . ' as ch', 'ch.id', '=', 'c.coach_id');
            $query->where('ch.id', '=', $filterList['coach']);
        }

        if (array_key_exists('schedule', $filterList) ){
            $query->join(Schedule::getFullTableName() . ' as sch', 'sch.id', '=', 'c.schedule_id');
            $query->where('sch.id', '=', $filterList['schedule']);
        }

        if (array_key_exists('membership', $filterList) ){
            $query->join(Membership::getFullTableName() . ' as mms', 'mms.id', '=', 'c.membership_id');
            $query->where('mms.id', '=', $filterList['membership']);
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
