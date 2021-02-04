<?php

namespace App\Services;

use App\Models\Schedule;
use App\Repositories\ScheduleRepository;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
/**
 * Class ScheduleService
 * @package App\Services
 */
class ScheduleService extends BaseService
{
    
    /**
     * __construct
     *
     * @return void
     */
    public function __construct(
        protected ScheduleRepository $scheduleRepository
    ){
        parent::__construct();
    }
    
    /**
     * getById
     *
     * @param  int $id
     * @return Schedule
     */
    public function getById($id){
        return $this->scheduleRepository->getById($id);
    }
    
    /**
     * getAll
     *
     * @param  array $data
     * @return Schedule[]
     */
    public function getAll($data = []){
        return $this->scheduleRepository->getAll(
            Arr::get($data, 'limit', 10),
            Arr::get($data, 'offset', 0),
            Arr::get($data, 'order', [['col' => 'sc.entry_time', 'dir' => 'asc']]),
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
        return $this->scheduleRepository->countAllFiltered(
            Arr::get($data, 'filterList', [])
        );
    }
    
    /**
     * countAll
     *
     * @return int
     */
    public function countAll(){
        return $this->scheduleRepository->countAll();
    }
    
    /**
     * create
     *
     * @param  array $data
     * @return Schedule
     */
    public function create($data = []) {
        $validationRules = [
            'entry_time' => 'required|string',
            'departure_time' => 'required|string'
        ];

        $validator = Validator::make($data, $validationRules);

        if ($validator->fails()) {
            $this->errors->merge($validator->errors());
        }

        $schedule = null;
        if (!$this->hasErrors()) {
            $schedule = new Schedule();
            $schedule->entry_time = $data['entry_time'];
            $schedule->departure_time = $data['departure_time'];
            $schedule->save();
        }
        return $schedule;
    }
    
    /**
     * update
     *
     * @param  Schedule $schedule
     * @param  array $data
     * @return Schedule
     */
    public function update(Schedule $schedule, $data = []) {
        $validationRules = [
            'entry_time' => 'required|string',
            'departure_time' => 'required|string'
        ];

        $validator = Validator::make($data, $validationRules);

        if ($validator->fails()) {
            $this->errors->merge($validator->errors());
        }

        if (!$this->hasErrors()) {
            $schedule->entry_time = $data['entry_time'];
            $schedule->departure_time = $data['departure_time'];
            $schedule->update();
        }
        return $schedule;
    }

}