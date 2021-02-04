<?php

namespace App\Services;

use App\Repositories\ClientRepository;
use Illuminate\Support\Arr;

/**
 * Class ClientService
 * @package App\Services
 */
class ClientService extends BaseService
{
    
    /**
     * __construct
     *
     * @return void
     */
    public function __construct(
        protected ClientRepository $clientRepository
    ){
        parent::__construct();
    }
    
    /**
     * getAll
     *
     * @param  array $data
     * @return Client[]
     */
    public function getAll($data = []){
        return $this->clientRepository->getAll(
            Arr::get($data, 'limit', 10),
            Arr::get($data, 'offset', 0),
            Arr::get($data, 'order', [['col' => 'c.first_last_name', 'dir' => 'asc']]),
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
        return $this->clientRepository->countAllFiltered(
            Arr::get($data, 'filterList', [])
        );
    }
    
    /**
     * countAll
     *
     * @return int
     */
    public function countAll(){
        return $this->clientRepository->countAll();
    }

}