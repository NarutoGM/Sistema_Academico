<?php

namespace App\Mail;

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotificacionSilabo extends Mailable
{
    use Queueable, SerializesModels;

    public $data;

    /**
     * Crear una nueva instancia del mensaje.
     */
    public function __construct($data)
    {
        $this->data = $data;
    }

    /**
     * Construir el mensaje.
     */
    public function build()
    {
        return $this->subject('Notificación de Sílabo')
                    ->view('emails.notificacion_silabo') // Ruta a la vista del correo
                    ->with('data', $this->data);
    }
}
