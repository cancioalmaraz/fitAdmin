<?php

namespace App\Services;

use Illuminate\Support\MessageBag;

class BaseService
{
    /**
     * @var MessageBag
     */
    protected $errors;

    /**
     * BaseService constructor.
     */
    public function __construct()
    {
        $this->errors = new MessageBag();
    }

    public function hasErrors() {
        return $this->errors->any();
    }

    public function getErrors() {
        return $this->errors;
    }

    public function clearErrors() {
        $this->errors = new MessageBag();
    }
}