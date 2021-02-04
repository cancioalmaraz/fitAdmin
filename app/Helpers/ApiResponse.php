<?php

namespace App\Helpers;

use Illuminate\Support\MessageBag;

class ApiResponse
{
    /**
     * @var string
     */
    public $type;

    /**
     * @var int
     */
    public $filterCount;

    /**
     * @var int
     */
    public $totalCount;

    /**
     * @var \JsonSerializable[]
     */
    public $results;

    /**
     * @var MessageBag
     */
    public $errors;

    /**
     * ApiResponse constructor.
     * @param string $type
     * @param \JsonSerializable[] $results
     * @param int $totalCount
     * @param null $filterCount
     */
    public function __construct($type, $results = [], $totalCount = null, $filterCount = null)
    {
        $this->type = $type;
        $this->results = $results;
        if (is_null($totalCount)) {
            $totalCount = count($this->results);
        }
        $this->totalCount = $totalCount;

        if (is_null($filterCount)) {
            $filterCount = $totalCount;
        }
        $this->filterCount = $filterCount;

        $this->errors = new MessageBag();
    }


}