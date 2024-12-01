<?php

namespace App\Http\Controllers;

use Symfony\Component\Process\Process;
use Symfony\Component\Process\Exception\ProcessFailedException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Google\Client as GoogleClient;

class TokenController extends Controller
{


    public function generateAccessToken()
{
    try {
        Log::info("Starting to generate Google access token.");

        // Ruta al archivo JSON de la cuenta de servicio
        $credentialsPath = Storage::path('service-account.json');
        Log::info("Service account file path: {$credentialsPath}");

        // Verifica si el archivo existe
        if (!file_exists($credentialsPath)) {
            Log::error("Service account file not found at path: {$credentialsPath}");
            return response()->json(['error' => 'Service account file not found'], 404);
        }

        // Configura el cliente de Google
        Log::info("Configuring Google Client.");
        $client = new GoogleClient();
        $client->setAuthConfig($credentialsPath);
        $client->addScope('https://www.googleapis.com/auth/drive'); // Cambia el scope según lo que necesites

        // Genera el token
        Log::info("Fetching access token from Google.");
        $token = $client->fetchAccessTokenWithAssertion();

        if (isset($token['error'])) {
            Log::error("Error fetching token: " . $token['error_description']);
            return response()->json(['error' => $token['error_description']], 500);
        }

        // Log del token generado (ten cuidado si incluyes esto en producción)
        Log::info("Token generated successfully: " . $token['access_token']);

        // Retorna el token
        return response()->json(['token' => $token['access_token']]);
    } catch (\Exception $e) {
        // Log del error
        Log::error("Failed to generate access token: " . $e->getMessage(), [
            'exception' => $e,
        ]);

        // Manejo del error
        return response()->json([
            'error' => 'Failed to generate access token',
            'details' => $e->getMessage(),
        ], 500);
    }
}
    
    
    
}
