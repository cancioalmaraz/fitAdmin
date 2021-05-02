<?php

namespace App\Services;

use App\Models\Coach;
use App\Repositories\CoachRepository;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Support\Carbon;
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
    ){
        parent::__construct();
    }
    
    /**
     * getById
     *
     * @param  int $id
     * @return Coach
     */
    public function getById($id){
        return $this->coachRepository->getById($id);
    }
    
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
            Arr::get($data, 'order', [['col' => 'amount_owed', 'dir' => 'desc']]),
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
    
    /**
     * create
     *
     * @param  array $data
     * @return Coach
     */
    public function create($data = []) {
        $validationRules = [
            'ci' => 'required|integer|unique:'.Coach::getTableName(),
            'name' => 'required|string',
            'first_last_name' => 'required|string',
            'second_last_name' => 'required|string'
        ];

        $validator = Validator::make($data, $validationRules);

        if ($validator->fails()) {
            $this->errors->merge($validator->errors());
        }

        $coach = null;
        if (!$this->hasErrors()) {
            $coach = new Coach();
            $coach->ci = $data['ci'];
            $coach->name = $data['name'];
            $coach->first_last_name = $data['first_last_name'];
            $coach->second_last_name = $data['second_last_name'];
            $coach->sex = Arr::get($data, 'sex');
            $coach->email = Arr::get($data, 'email');
            $coach->phone = Arr::get($data, 'phone');
            $coach->address = Arr::get($data, 'address');
            if (array_key_exists('date_of_birth', $data)){
                $coach->date_of_birth = Carbon::parse(Arr::get($data, 'date_of_birth'))->format('Y-m-d');
            }
            $coach->save();
        }
        return $coach;
    }
    
    /**
     * update
     *
     * @param  Coach $coach
     * @param  array $data
     * @return Coach
     */
    public function update(Coach $coach, $data = []) {
        $validationRules = [
            'ci' => [
                'required',
                'integer',
                Rule::unique(Coach::getTableName())->ignore($coach->id)
            ],
            'name' => 'required|string',
            'first_last_name' => 'required|string',
            'second_last_name' => 'required|string'
        ];

        $validator = Validator::make($data, $validationRules);

        if ($validator->fails()) {
            $this->errors->merge($validator->errors());
        }

        if (!$this->hasErrors()) {
            $coach->ci = $data['ci'];
            $coach->name = $data['name'];
            $coach->first_last_name = $data['first_last_name'];
            $coach->second_last_name = $data['second_last_name'];
            $coach->sex = Arr::get($data, 'sex');
            $coach->email = Arr::get($data, 'email');
            $coach->phone = Arr::get($data, 'phone');
            $coach->address = Arr::get($data, 'address');
            
            if (array_key_exists('date_of_birth', $data)){
                $coach->date_of_birth = Carbon::parse(Arr::get($data, 'date_of_birth'))->format('Y-m-d');
            } else {
                $coach->date_of_birth = null;
            }

            $coach->update();
        }
        return $coach;
    }

}