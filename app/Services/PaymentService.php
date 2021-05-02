<?php

namespace App\Services;

use App\Models\Payment;
use App\Repositories\PaymentRepository;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Carbon;

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
        protected PaymentRepository $paymentRepository,
        protected ClientService $clientService
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
            Arr::get($data, 'order', [['col' => 'pm.created_at', 'dir' => 'desc']]),
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

            $firstCoach = null;
            $foundFirstCoach = false;
            foreach ($data['clientList'] as $i => $clientId) {
                if (!$foundFirstCoach) {
                    $client = $this->clientService->getById($clientId);
                    $firstCoach = $client->coach;
                    if (!is_null($firstCoach)){
                        $foundFirstCoach = true;
                    }

                    if ( is_null($firstCoach) && $i === count($data['clientList']) - 1 ) {
                        $this->errors->add('Coach', 'Ningun cliente tiene asignado un coach');
                    }
                } else {
                    $client = $this->clientService->getById($clientId);

                    if (is_null($client)) {
                        $this->errors->add('Coach', 'Existe un cliente que no tiene coach asignado');
                        break;
                    }

                    if (!is_null($client->coach) && !is_null($firstCoach)) {
                        if ( $firstCoach->id !== $client->coach->id ){
                            $this->errors->add('Coach', 'Los clientes de los que se quiere realizar el pago tienen distintos coaches');
                            break;
                        }
                    }
                }
            }

            if (!$this->hasErrors()) {
                $payment = new Payment();
                if (array_key_exists('start_date', $data)) {
                    $payment->start_date = Carbon::parse(Arr::get($data, 'start_date'))->format('Y-m-d');
                } else {
                    $payment->start_date = null;
                }
                if (array_key_exists('end_date', $data)) {
                    $payment->end_date = Carbon::parse(Arr::get($data, 'end_date'))->format('Y-m-d');
                }
                $payment->payment_amount = $data['payment_amount'];
                if (array_key_exists('notes', $data)) {
                    $payment->notes = $data['notes'];
                }

                if (!is_null($firstCoach)) {
                    $payment->coach_id = $firstCoach->id;
                }

                $payment->save();
                $payment->clients()->sync($data['clientList']);
            }

        }

        return $payment;
    }
}
