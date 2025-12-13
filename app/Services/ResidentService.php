<?php
declare(strict_types=1);

namespace App\Services;

use App\Core\Database;
use App\Models\Condominium;
use App\Models\Resident;
use App\Models\ResidentUnit;
use App\Utils\CpfValidator;

final class ResidentService
{
    public static function createWithUnits(array $payload, int $createdBy): int
    {
        $pdo = Database::pdo();
        $pdo->beginTransaction();

        try {
            $first = trim((string)($payload['first_name'] ?? ''));
            $last  = trim((string)($payload['last_name'] ?? ''));
            $doc   = trim((string)($payload['document_number'] ?? ''));

            if ($first === '' || $last === '' || $doc === '') {
                throw new \Exception("Nome, sobrenome e CPF são obrigatórios.", 422);
            }

            // Normaliza CPF
            $cpf = preg_replace('/\D+/', '', $doc) ?? '';

            // Valida CPF
            if (!CpfValidator::isValid($cpf)) {
                throw new \Exception("CPF inválido.", 422);
            }

            // Verifica duplicidade
            if (Resident::existsByDocumentNumber($cpf)) {
                throw new \Exception("Já existe um morador cadastrado com este CPF.", 409);
            }

            $dwellings = $payload['dwellings'] ?? null;
            if (!is_array($dwellings) || count($dwellings) === 0) {
                throw new \Exception("Informe pelo menos uma unidade residencial.", 422);
            }

            $residentId = Resident::create([
                'first_name' => $first,
                'last_name' => $last,
                'email' => $payload['email'] ?? null,
                'document_number' => $cpf,
                'phone' => $payload['phone_number'] ?? null,
                'phone_type' => $payload['phone_type'] ?? null,
                'zip_code' => $payload['zip_code'] ?? null,
                'street' => $payload['street_address'] ?? null,
                'number' => $payload['street_number'] ?? null,
                'address_complement' => $payload['address_complement'] ?? null,
                'state' => $payload['state'] ?? null,
                'city' => $payload['city'] ?? null,
                'created_by' => $createdBy,
            ]);

            foreach ($dwellings as $idx => $dw) {
                $condoId = (int)($dw['condominium_id'] ?? 0);
                if ($condoId <= 0) {
                    throw new \Exception("Condomínio inválido na unidade #" . ($idx + 1) . ".", 422);
                }

                $condo = Condominium::findById($condoId);
                if (!$condo) {
                    throw new \Exception("Condomínio não encontrado (ID {$condoId}).", 404);
                }

                $unitId = UnitService::getOrCreate(
                    $condoId,
                    (string)$condo['condo_type'],
                    [
                        'block' => $dw['block'] ?? null,
                        'tower' => $dw['tower'] ?? null,
                        'floor' => $dw['floor'] ?? null,
                        'street' => $dw['street'] ?? null,
                        'unit_number' => $dw['unit_number'] ?? null,
                    ],
                    $createdBy
                );

                if (ResidentUnit::unitHasActiveResident($unitId)) {
                    throw new \Exception("Esta unidade já possui um morador ativo.", 409);
                }

                ResidentUnit::link($residentId, $unitId);
            }

            $pdo->commit();
            return $residentId;
        } catch (\Throwable $e) {
            $pdo->rollBack();
            throw $e;
        }
    }
}
