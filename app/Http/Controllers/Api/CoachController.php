<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Models\Coach;
use App\Http\Controllers\Controller;
use App\Services\CoachService;
use Illuminate\Http\Request;

class CoachController extends Controller
{

    public function __construct(
        protected CoachService $coachService
    ){}

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $apiRes = new ApiResponse('Coach');
        $apiRes->results = $this->coachService->getAll($request->input());
        $apiRes->totalCount = $this->coachService->countAll();
        $apiRes->filterCount = $this->coachService->countAllFiltered($request->input());
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
        $apiRes = new ApiResponse('Coach');
        $coach = $this->coachService->create($request->input());

        if ($this->coachService->hasErrors()){
            $apiRes->errors = $this->coachService->getErrors();
            return response()->json($apiRes, 400);
        }

        $apiRes->results = $coach;
        $apiRes->totalCount = 1;
        $apiRes->filterCount = 1;
        return response()->json($apiRes);
    }

    /**
     * Display the specified resource.
     *
     * @param  App\Models\Coach  $coach
     * @return \Illuminate\Http\Response
     */
    public function show(Coach $coach)
    {
        $apiRes = new ApiResponse('Coach');
        $apiRes->results = $coach;
        $apiRes->totalCount = 1;
        $apiRes->filterCount = 1;
        return response()->json($apiRes);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  App\Models\Coach  $coach
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Coach $coach)
    {
        $apiRes = new ApiResponse('Coach');
        $coach = $this->coachService->update($coach, $request->input());

        if ($this->coachService->hasErrors()){
            $apiRes->errors = $this->coachService->getErrors();
            return response()->json($apiRes, 400);
        }

        $apiRes->results = $coach;
        $apiRes->totalCount = 1;
        $apiRes->filterCount = 1;
        return response()->json($apiRes);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  App\Models\Coach  $coach
     * @return \Illuminate\Http\Response
     */
    public function destroy(Coach $coach)
    {
        $apiRes = new ApiResponse('Coach');
        $apiRes->results = $coach->delete();
        return response()->json($apiRes);
    }
}
