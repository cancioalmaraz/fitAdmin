<?php

namespace App\Services;

use App\Models\Membership;
use App\Repositories\MembershipRepository;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
/**
 * Class MembershipService
 * @package App\Services
 */
class MembershipService extends BaseService
{
    
    /**
     * __construct
     *
     * @return void
     */
    public function __construct(
        protected MembershipRepository $membershipRepository
    ){
        parent::__construct();
    }
    
    /**
     * getById
     *
     * @param  int $id
     * @return Membership
     */
    public function getById($id){
        return $this->membershipRepository->getById($id);
    }
    
    /**
     * getAll
     *
     * @param  array $data
     * @return Membership[]
     */
    public function getAll($data = []){
        return $this->membershipRepository->getAll(
            Arr::get($data, 'limit', 10),
            Arr::get($data, 'offset', 0),
            Arr::get($data, 'order', [['col' => 'm.name', 'dir' => 'asc']]),
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
        return $this->membershipRepository->countAllFiltered(
            Arr::get($data, 'filterList', [])
        );
    }
    
    /**
     * countAll
     *
     * @return int
     */
    public function countAll(){
        return $this->membershipRepository->countAll();
    }
    
    /**
     * create
     *
     * @param  array $data
     * @return Membership
     */
    public function create($data = []) {
        $validationRules = [
            'name' => 'required|string|unique:'.Membership::getTableName()
        ];

        $validator = Validator::make($data, $validationRules);

        if ($validator->fails()) {
            $this->errors->merge($validator->errors());
        }

        $membership = null;
        if (!$this->hasErrors()) {
            $membership = new Membership();
            $membership->name = $data['name'];
            $membership->save();
        }
        return $membership;
    }
    
    /**
     * update
     *
     * @param  Membership $membership
     * @param  array $data
     * @return Membership
     */
    public function update(Membership $membership, $data = []) {
        $validationRules = [
            'name' => 'required|string|unique:'.Membership::getTableName()
        ];

        $validator = Validator::make($data, $validationRules);

        if ($validator->fails()) {
            $this->errors->merge($validator->errors());
        }

        if (!$this->hasErrors()) {
            $membership->name = $data['name'];
            $membership->update();
        }
        return $membership;
    }

}