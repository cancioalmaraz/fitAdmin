<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Http\Controllers\Controller;
use App\Models\Client;
use App\Services\ClientService;
use App\Services\CoachService;
use App\Services\MembershipService;
use App\Services\ScheduleService;
use Illuminate\Http\Request;

class ClientController extends Controller
{

    public function __construct(
        protected ClientService $clientService,
        protected CoachService $coachService,
        protected MembershipService $membershipService,
        protected ScheduleService $scheduleService
    ){}

    /**
     * index
     *
     * @param  Request $request
     * @return Response
     */
    public function index(Request $request)
    {
        $apiRes = new ApiResponse('Client');
        $apiRes->results = $this->clientService->getAll($request->input());
        $apiRes->totalCount = $this->clientService->countAll();
        $apiRes->filterCount = $this->clientService->countAllFiltered($request->input());
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
        $apiRes = new ApiResponse('Client');

        $coach = null;
        $membership = null;
        $schedule = null;

        if (array_key_exists('coach', $request->input())){
            $coach = $this->coachService->getById($request->input('coach.id'));
        }

        if (array_key_exists('membership', $request->input())){
            $membership = $this->membershipService->getById($request->input('membership.id'));
        }

        if (array_key_exists('schedule', $request->input())){
            $schedule = $this->scheduleService->getById($request->input('schedule.id'));
        }

        $client = $this->clientService->create($coach, $membership, $schedule, $request->input());

        if ($this->clientService->hasErrors()){
            $apiRes->errors = $this->clientService->getErrors();
            return response()->json($apiRes, 400);
        }

        $apiRes->results = $client;
        $apiRes->totalCount = 1;
        $apiRes->filterCount = 1;
        return response()->json($apiRes);
    }

    /**
     * Display the specified resource.
     *
     * @param  App\Models\Client  $client
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $apiRes = new ApiResponse('Client');
        $client = $this->clientService->getById($id);

        if (is_null($client)){
            $apiRes->errors->add('Client', 'Client Not Found');
            return response()->json($apiRes, 404);
        }

        $apiRes->results = $client;
        $apiRes->totalCount = 1;
        $apiRes->filterCount = 1;
        return response()->json($apiRes);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  App\Models\Client  $client
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Client $client)
    {
        $apiRes = new ApiResponse('Client');

        $coach = null;
        $membership = null;
        $schedule = null;

        if (array_key_exists('coach', $request->input())){
            $coach = $this->coachService->getById($request->input('coach.id'));
        }

        if (array_key_exists('membership', $request->input())){
            $membership = $this->membershipService->getById($request->input('membership.id'));
        }

        if (array_key_exists('schedule', $request->input())){
            $schedule = $this->scheduleService->getById($request->input('schedule.id'));
        }

        $client = $this->clientService->update($client, $coach, $membership, $schedule, $request->input());

        if ($this->clientService->hasErrors()){
            $apiRes->errors = $this->clientService->getErrors();
            return response()->json($apiRes, 400);
        }

        $apiRes->results = $client;
        $apiRes->totalCount = 1;
        $apiRes->filterCount = 1;
        return response()->json($apiRes);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  App\Models\Client  $client
     * @return \Illuminate\Http\Response
     */
    public function destroy(Client $client)
    {
        $apiRes = new ApiResponse('Client');
        $apiRes->results = $client->delete();
        return response()->json($apiRes);
    }
}
