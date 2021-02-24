<?php

namespace App\Services;

use App\Models\Payment;
use App\Repositories\PaymentRepository;
use Illuminate\Support\Arr;
/**
 * Class PaymentService
 * @package App\Services
 */
class PaymentService extends BaseService
{
    
    /**
     * __construct
     *
     * @return void
     */
    public function __construct(
        protected PaymentRepository $paymentRepository
    ){
        parent::__construct();
    }
    
    /**
     * getById
     *
     * @param  int $id
     * @return Payment
     */
    public function getById($id){
        return $this->paymentRepository->getById($id);
    }
    
    /**
     * getAll
     *
     * @param  array $data
     * @return Payment[]
     */
    public function getAll($data = []){
        return $this->paymentRepository->getAll(
            Arr::get($data, 'limit', 10),
            Arr::get($data, 'offset', 0),
            Arr::get($data, 'order', [['col' => 'pm.created_at', 'dir' => 'asc']]),
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
        return $this->paymentRepository->countAllFiltered(
            Arr::get($data, 'filterList', [])
        );
    }
    
    /**
     * countAll
     *
     * @return int
     */
    public function countAll(){
        return $this->paymentRepository->countAll();
    }

    /**
     * create
     *
     * @param  array $data
     * @return Payment
     */
    public function create($data = []) {}
}