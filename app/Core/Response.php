<?php

namespace App\Core;

class Response
{
    public static function json(array $data, int $statusCode = 200)
    {        http_response_code($statusCode);
        header('Content-Type: application/json');
        echo json_encode($data);
        exit;
    }
}