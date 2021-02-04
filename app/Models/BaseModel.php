<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class BaseModel extends Model
{
    /**
     * The attributes that should be mutated to dates.
     *
     * @var array
     */
    protected $dates = [
        'created_at',
        'updated_at',
        'deleted_at',
        'started_at',
        'finished_at'
    ];

    const TO_ARRAY_MIN = 'min';
    const TO_ARRAY_FULL = 'full';

    
    public function __construct(array $attributes = [])
    {
        parent::__construct($attributes);
        if (is_null($this->connection)) {
            $this->connection = config('database.default');
        }
        $driver = config("database.connections.{$this->connection}.driver");
        if ($driver == 'sqlsrv') {
            $this->dateFormat = config('app.env') == 'local' ? 'Y-m-d H:i:s' : 'Y-m-d H:i:s.v';
        }
    }

    public static function getTableName()
    {
        return with(new static)->getTable();
    }

    public static function getStaticConnectionName() {
        $connName = with(new static)->getConnectionName();
        if (is_null($connName)) {
            $connName = config('database.default');
        }
        return $connName;
    }

    public static function getDbName() {
        return config('database.connections.'.static::getStaticConnectionName().'.database');
    }

    public static function getFullTableName() {
        $connection = config('database.default');
        if ($connection == 'vetimages_mssql') {
            return static::getDbName().'.dbo.'.static::getTableName();
        }else{
            return static::getDbName().'.'.static::getTableName();
        }
    }
}