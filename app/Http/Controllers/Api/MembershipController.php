<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Models\Membership;
use App\Http\Controllers\Controller;
use App\Services\MembershipService;
use Illuminate\Http\Request;

class MembershipController extends Controller
{

    public function __construct(
        protected MembershipService $membershipService
    ){}

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $apiRes = new ApiResponse('Membership');
        $apiRes->results = $this->membershipService->getAll($request->input());
        $apiRes->totalCount = $this->membershipService->countAll();
        $apiRes->filterCount = $this->membershipService->countAllFiltered($request->input());
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
        $apiRes = new ApiResponse('Membership');
        $membership = $this->membershipService->create($request->input());

        if ($this->membershipService->hasErrors()){
            $apiRes->errors = $this->membershipService->getErrors();
            return response()->json($apiRes, 400);
        }

        $apiRes->results = $membership;
        $apiRes->totalCount = 1;
        $apiRes->filterCount = 1;
        return response()->json($apiRes);
    }

    /**
     * Display the specified resource.
     *
     * @param  App\Models\Membership  $membership
     * @return \Illuminate\Http\Response
     */
    public function show(Membership $membership)
    {
        $apiRes = new ApiResponse('Membership');
        $apiRes->results = $membership;
        $apiRes->totalCount = 1;
        $apiRes->filterCount = 1;
        return response()->json($apiRes);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  App\Models\Membership  $membership
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Membership $membership)
    {
        $apiRes = new ApiResponse('Membership');
        $membership = $this->membershipService->update($membership, $request->input());

        if ($this->membershipService->hasErrors()){
            $apiRes->errors = $this->membershipService->getErrors();
            return response()->json($apiRes, 400);
        }

        $apiRes->results = $membership;
        $apiRes->totalCount = 1;
        $apiRes->filterCount = 1;
        return response()->json($apiRes);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  App\Models\Membership  $membership
     * @return \Illuminate\Http\Response
     */
    public function destroy(Membership $membership)
    {
        $apiRes = new ApiResponse('Membership');
        $apiRes->results = $membership->delete();
        return response()->json($apiRes);
    }
}
