<?php

use App\Repositories\ClientRepository;
use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::get('test', function(){
    $r = app(ClientRepository::class);
    $filterList = [
        'ci' => 24324
    ];
    return response()->json([
        'totalCount' => $r->countAll(),
        'filterCount' => $r->countAllFiltered($filterList),
        'results' => $r->getAll(10, 0, [['col' => 'c.first_last_name', 'dir' => 'asc']], $filterList)
    ]);
});

Route::apiResource('clients', 'Api\ClientController');