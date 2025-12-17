<?php
declare(strict_types=1);

namespace App\Models;

use App\Core\Database;
use PDO;

final class PermissionModel
{
    public function all(): array
    {
        $stmt = Database::pdo()->query(
            'SELECT id, name, description
             FROM permissions
             ORDER BY name'
        );

        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }
}
