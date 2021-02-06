<?php

namespace App\Services;

use App\Models\Client;
use App\Repositories\ClientRepository;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

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
     * getById
     *
     * @param  int $id
     * @return Client
     */
    public function getById($id){
        return $this->clientRepository->getById($id);
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
            Arr::get($data, 'order', [['col' => 'remaining_days', 'dir' => 'asc']]),
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

    /**
     * create
     *
     * @param  array $data
     * @return Client
     */
    public function create($coach = null, $membership = null, $schedule = null, $data = []) {
        $validationRules = [
            'ci' => 'required|integer|unique:'.Client::getTableName(),
            'name' => 'required|string',
            'first_last_name' => 'required|string',
            'second_last_name' => 'required|string',
            'sex' => 'string',
            'age' => 'integer',
            'email' => 'email',
            'phone' => 'string',
            'address' => 'string'
        ];

        $validator = Validator::make($data, $validationRules);

        if ($validator->fails()) {
            $this->errors->merge($validator->errors());
        }

        $client = null;
        if (!$this->hasErrors()) {
            $client = new Client();
            $client->ci = $data['ci'];
            $client->name = $data['name'];
            $client->first_last_name = $data['first_last_name'];
            $client->second_last_name = $data['second_last_name'];
            $client->sex = Arr::get($data, 'sex');
            $client->age = Arr::get($data, 'age');
            $client->email = Arr::get($data, 'email');
            $client->phone = Arr::get($data, 'phone');
            $client->address = Arr::get($data, 'address');

            if (!is_null($coach)){
                $client->coach()->associate($coach);
            }
            if (!is_null($membership)){
                $client->membership()->associate($membership);
            }
            if (!is_null($schedule)){
                $client->schedule()->associate($schedule);
            }

            $client->save();
        }
        return $client;
    }

    /**
     * create
     *
     * @param  array $data
     * @return Client
     */
    public function update(Client $client, $coach = null, $membership = null, $schedule = null, $data = []) {
        $validationRules = [
            'ci' => [
                'required',
                'integer',
                Rule::unique(Client::getTableName())->ignore($client->id)
            ],
            'name' => 'required|string',
            'first_last_name' => 'required|string',
            'second_last_name' => 'required|string',
            'sex' => 'string',
            'age' => 'integer',
            'email' => 'email',
            'phone' => 'string',
            'address' => 'string'
        ];

        $validator = Validator::make($data, $validationRules);

        if ($validator->fails()) {
            $this->errors->merge($validator->errors());
        }

        if (!$this->hasErrors()) {
            $client->ci = $data['ci'];
            $client->name = $data['name'];
            $client->first_last_name = $data['first_last_name'];
            $client->second_last_name = $data['second_last_name'];
            $client->sex = Arr::get($data, 'sex');
            $client->age = Arr::get($data, 'age');
            $client->email = Arr::get($data, 'email');
            $client->phone = Arr::get($data, 'phone');
            $client->address = Arr::get($data, 'address');

            if (!is_null($coach)){
                $client->coach()->associate($coach);
            }
            if (!is_null($membership)){
                $client->membership()->associate($membership);
            }
            if (!is_null($schedule)){
                $client->schedule()->associate($schedule);
            }
            
            $client->update();
        }
        return $client;
    }

}