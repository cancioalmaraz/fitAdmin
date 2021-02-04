<?php

namespace App\Services;

use App\Repositories\CoachRepository;
use Illuminate\Support\Arr;

/**
 * Class CoachService
 * @package App\Services
 */
class CoachService extends BaseService
{
    
    /**
     * __construct
     *
     * @return void
     */
    public function __construct(
        protected CoachRepository $coachRepository
    ){}
    
    /**
     * getAll
     *
     * @param  array $data
     * @return Coach[]
     */
    public function getAll($data = []){
        return $this->coachRepository->getAll(
            Arr::get($data, 'limit', 10),
            Arr::get($data, 'offset', 0),
            Arr::get($data, 'order', [['col' => 'ch.first_last_name', 'dir' => 'asc']]),
            Arr::get($data, 'filterList', [])
        );
    }
    
    /**
     * countAllFiltered
     *
     * @param  array $data
     * @return int
     */
    public function countAllFiltered($data = []){
        return $this->coachRepository->countAllFiltered(
            Arr::get($data, 'filterList', [])
        );
    }
    
    /**
     * countAll
     *
     * @return int
     */
    public function countAll(){
        return $this->coachRepository->countAll();
    }

}