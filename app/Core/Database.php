<?php

namespace App\Core;

use PDO;
use PDOException;
use Exception;

class Database
{
    /** @var array Guarda as instâncias de conexão ativas. */
    private static $connections = [];

    /** @var array Carrega as configurações do arquivo. */
    private static $config;

    /**
     * Obtém uma instância de conexão PDO.
     *
     * @param string|null $name O nome da conexão (ex: 'mysql' ou 'sqlsrv'). Se nulo, usa a padrão.
     * @return PDO
     * @throws Exception
     */
    public static function getConnection(string $name = null): PDO
    {
        if (is_null(self::$config)) {
            self::$config = require __DIR__ . '/../../config/database.php';
        }

        $name = $name ?? self::$config['default'];

        if (isset(self::$connections[$name])) {
            return self::$connections[$name];
        }

        if (!isset(self::$config['connections'][$name])) {
            throw new Exception("Configuração de banco de dados não encontrada para '{$name}'.");
        }

        $dbConfig = self::$config['connections'][$name];

        try {

            $dsn = self::buildDsn($dbConfig);


            $pdo = new PDO($dsn, $dbConfig['username'], $dbConfig['password']);
            $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);


            return self::$connections[$name] = $pdo;

        } catch (PDOException $e) {

            throw new Exception("Falha na conexão com o banco de dados '{$name}': " . $e->getMessage());
        }
    }

   private static function buildDsn(array $config): string
    {
        $driver = $config['driver'];

        if ($driver === 'mysql') {
            return "mysql:host={$config['host']};port={$config['port']};dbname={$config['database']};charset={$config['charset']}";
        }

        if ($driver === 'sqlsrv') {
            // Adiciona a opção diretamente na string
            return "sqlsrv:Server={$config['host']},{$config['port']};Database={$config['database']};TrustServerCertificate=yes";
        }
        
        throw new Exception("Driver de banco de dados '{$driver}' não suportado.");
    }
}