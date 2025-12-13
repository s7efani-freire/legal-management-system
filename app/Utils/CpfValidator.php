<?php
declare(strict_types=1);

namespace App\Utils;

final class CpfValidator
{
    public static function isValid(string $cpf): bool
    {
        // Remove tudo que não for número
        $cpf = preg_replace('/\D+/', '', $cpf);

        // Deve ter 11 dígitos
        if (!$cpf || strlen($cpf) !== 11) {
            return false;
        }

        // Elimina CPFs inválidos conhecidos (111.111.111-11 etc)
        if (preg_match('/^(\d)\1{10}$/', $cpf)) {
            return false;
        }

        // Validação dos dígitos verificadores
        for ($t = 9; $t < 11; $t++) {
            $sum = 0;
            for ($i = 0; $i < $t; $i++) {
                $sum += (int)$cpf[$i] * (($t + 1) - $i);
            }
            $digit = ((10 * $sum) % 11) % 10;
            if ((int)$cpf[$t] !== $digit) {
                return false;
            }
        }

        return true;
    }
}
