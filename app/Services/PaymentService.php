<?php

namespace App\Services;

use App\Models\Payment;
use App\Repositories\PaymentRepository;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;

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
    ) {
        parent::__construct();
    }

    /**
     * getById
     *
     * @param  int $id
     * @return Payment
     */
    public function getById($id)
    {
        return $this->paymentRepository->getById($id);
    }

    /**
     * getAll
     *
     * @param  array $data
     * @return Payment[]
     */
    public function getAll($data = [])
    {
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
    public function countAllFiltered($data = [])
    {
        return $this->paymentRepository->countAllFiltered(
            Arr::get($data, 'filterList', [])
        );
    }

    /**
     * countAll
     *
     * @return int
     */
    public function countAll()
    {
        return $this->paymentRepository->countAll();
    }

    /**
     * create
     *
     * @param  array $data
     * @return Payment
     */
    public function create($data = [])
    {
        $validationRules = [
            'end_date' => 'required|date',
            'payment_amount' => 'required|numeric',
            'clientList' => 'required|array|min:1'
        ];

        $validator = Validator::make($data, $validationRules);

        if ($validator->fails()) {
            $this->errors->merge($validator->errors());
        }

        $payment = null;
        if (!$this->hasErrors()) {
            $payment = new Payment();
            if (array_key_exists('start_date', $data)) {
                $payment->start_date = $data['start_date'];
            }
            $payment->end_date = $data['end_date'];
            $payment->payment_amount = $data['payment_amount'];
            if (array_key_exists('notes', $data)) {
                $payment->notes = $data['notes'];
            }
            $payment->save();
            $payment->clients()->sync($data['clientList']);
        }
        return $payment;
    }
}
