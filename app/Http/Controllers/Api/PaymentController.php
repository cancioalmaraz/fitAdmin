<?php

namespace App\Http\Controllers\Api;

use App\Helpers\ApiResponse;
use App\Models\Payment;
use App\Http\Controllers\Controller;
use App\Services\PaymentService;
use Illuminate\Http\Request;

class PaymentController extends Controller
{

    public function __construct(
        protected PaymentService $paymentService
    ) {
    }

    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $apiRes = new ApiResponse('Payment');
        $apiRes->results = $this->paymentService->getAll($request->input());
        $apiRes->totalCount = $this->paymentService->countAll();
        $apiRes->filterCount = $this->paymentService->countAllFiltered($request->input());
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
        $apiRes = new ApiResponse('Payment');
        $payment = $this->paymentService->create($request->input());

        if ($this->paymentService->hasErrors()) {
            $apiRes->errors = $this->paymentService->getErrors();
            return response()->json($apiRes, 400);
        }

        $apiRes->results = $payment;
        $apiRes->totalCount = 1;
        $apiRes->filterCount = 1;
        return response()->json($apiRes);
    }

    /**
     * Display the specified resource.
     *
     * @param  App\Models\Payment  $payment
     * @return \Illuminate\Http\Response
     */
    public function show(Payment $payment)
    {
        $apiRes = new ApiResponse('Payment');
        $apiRes->results = $payment;
        $apiRes->totalCount = 1;
        $apiRes->filterCount = 1;
        return response()->json($apiRes);
    }
}
