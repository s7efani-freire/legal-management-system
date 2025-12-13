<?php
declare(strict_types=1);

namespace App\Models;

use App\Core\Database;

use PDO;


final class Resident {
  public static function create(array $data): int {
    $pdo = Database::pdo();
    $sql = "INSERT INTO residents
      (first_name, last_name, email, document_number, phone, phone_type, zip_code, street, number, address_complement, state, city, created_by)
      VALUES
      (:first_name, :last_name, :email, :document_number, :phone, :phone_type, :zip_code, :street, :number, :address_complement, :state, :city, :created_by)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute($data);
    return (int)$pdo->lastInsertId();
  }
  public static function existsByDocumentNumber(string $doc): bool
{
    $pdo = Database::pdo();
    $stmt = $pdo->prepare("SELECT 1 FROM residents WHERE document_number = ? LIMIT 1");
    $stmt->execute([$doc]);
    return (bool)$stmt->fetchColumn();
}
public static function list(array $filters = []): array
    {
        $pdo = Database::pdo();

        $sql = "
            SELECT
                r.id,
                r.first_name,
                r.last_name,
                r.document_number,
                r.email,
                r.phone,
                r.phone_type
            FROM residents r
            WHERE 1=1
        ";

        $params = [];

        if (!empty($filters['name'])) {
            $sql .= " AND (r.first_name LIKE :name OR r.last_name LIKE :name)";
            $params[':name'] = '%' . $filters['name'] . '%';
        }

        if (!empty($filters['document'])) {
            $sql .= " AND r.document_number LIKE :doc";
            $params[':doc'] = '%' . $filters['document'] . '%';
        }

        // filtrar por condomínio (via vínculo residente -> unidade -> condomínio)
        if (!empty($filters['condominium_id'])) {
            $sql .= "
                AND EXISTS (
                    SELECT 1
                    FROM resident_units ru
                    JOIN residential_units u ON u.id = ru.unit_id
                    WHERE ru.resident_id = r.id
                      AND ru.end_date IS NULL
                      AND u.condominium_id = :condo_id
                )
            ";
            $params[':condo_id'] = (int)$filters['condominium_id'];
        }

        if (!empty($filters['condominium_name'])) {
            $sql .= "
                AND EXISTS (
                    SELECT 1
                    FROM resident_units ru
                    JOIN residential_units u ON u.id = ru.unit_id
                    JOIN condominiums c ON c.id = u.condominium_id
                    WHERE ru.resident_id = r.id
                      AND ru.end_date IS NULL
                      AND (c.trade_name LIKE :condo_name OR c.corporate_name LIKE :condo_name)
                )
            ";
            $params[':condo_name'] = '%' . $filters['condominium_name'] . '%';
        }

        $sql .= " ORDER BY r.id DESC";

        $stmt = $pdo->prepare($sql);
        foreach ($params as $k => $v) $stmt->bindValue($k, $v);
        $stmt->execute();

        $residents = $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];

        // carregar dwellings de cada resident (para popup e coluna “Condomínio”)
        if (!$residents) return [];

        $ids = array_map(fn($r) => (int)$r['id'], $residents);
        $in  = implode(',', array_fill(0, count($ids), '?'));

        $sqlDw = "
            SELECT
                ru.resident_id,
                c.trade_name AS condominium_trade_name,
                c.corporate_name AS condominium_corporate_name,
                u.block,
                u.number AS unit_number
            FROM resident_units ru
            JOIN residential_units u ON u.id = ru.unit_id
            JOIN condominiums c ON c.id = u.condominium_id
            WHERE ru.end_date IS NULL
              AND ru.resident_id IN ($in)
            ORDER BY ru.resident_id, c.id, u.id
        ";

        $st2 = $pdo->prepare($sqlDw);
        foreach ($ids as $i => $id) $st2->bindValue($i + 1, $id, PDO::PARAM_INT);
        $st2->execute();

        $dwRows = $st2->fetchAll(PDO::FETCH_ASSOC) ?: [];

        $dwByResident = [];
        foreach ($dwRows as $dw) {
            $rid = (int)$dw['resident_id'];
            $condoName = $dw['condominium_trade_name'] ?: $dw['condominium_corporate_name'];

            $dwByResident[$rid][] = [
                'unit_number' => (string)($dw['unit_number'] ?? ''),
                'building_block' => $dw['block'] ?? null,
                'condominium' => $condoName ?? '',
            ];
        }

        // anexar no array final
        foreach ($residents as &$r) {
            $rid = (int)$r['id'];
            $r['dwellings'] = $dwByResident[$rid] ?? [];
        }
        unset($r);

        return $residents;
    }

}
