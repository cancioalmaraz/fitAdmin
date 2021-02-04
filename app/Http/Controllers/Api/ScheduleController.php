<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Schedule;
use App\Services\ScheduleService;
use Illuminate\Http\Request;

class ScheduleController extends Controller
{

    public function __construct(
        protected ScheduleService $scheduleService
    ){}

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $apiRes = new ApiResponse('Schedule');
        $apiRes->results = $this->scheduleService->getAll($request->input());
        $apiRes->totalCount = $this->scheduleService->countAll();
        $apiRes->filterCount = $this->scheduleService->countAllFiltered($request->input());
        return response()->json($apiRes);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $apiRes = new ApiResponse('Schedule');
        $schedule = $this->scheduleService->create($request->input());

        if ($this->scheduleService->hasErrors()){
            $apiRes->errors = $this->scheduleService->getErrors();
            return response()->json($apiRes, 400);
        }

        $apiRes->results = $schedule;
        $apiRes->totalCount = 1;
        $apiRes->filterCount = 1;
        return response()->json($apiRes);
    }

    /**
     * Display the specified resource.
     *
     * @param  App\Models\Schedule  $schedule
     * @return \Illuminate\Http\Response
     */
    public function show(Schedule $schedule)
    {
        $apiRes = new ApiResponse('Schedule');
        $apiRes->results = $schedule;
        $apiRes->totalCount = 1;
        $apiRes->filterCount = 1;
        return response()->json($apiRes);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  App\Models\Schedule  $schedule
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Schedule $schedule)
    {
        $apiRes = new ApiResponse('Schedule');
        $schedule = $this->scheduleService->update($schedule, $request->input());

        if ($this->scheduleService->hasErrors()){
            $apiRes->errors = $this->scheduleService->getErrors();
            return response()->json($apiRes, 400);
        }

        $apiRes->results = $schedule;
        $apiRes->totalCount = 1;
        $apiRes->filterCount = 1;
        return response()->json($apiRes);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  App\Models\Schedule  $schedule
     * @return \Illuminate\Http\Response
     */
    public function destroy(Schedule $schedule)
    {
        $apiRes = new ApiResponse('Schedule');
        $apiRes->results = $schedule->delete();
        return response()->json($apiRes);
    }
}
