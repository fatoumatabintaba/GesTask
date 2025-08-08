<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class TaskCompletedNotification extends Notification
{
    // use Queueable;
    public $task;
    public $employee;

    /**
     * Create a new notification instance.
     */
    public function __construct($task, $employee)
    {
       $this->task = $task;
       $this->employee = $employee;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via( $notifiable)
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail( $notifiable)
    {
        return (new MailMessage)
            ->subject('Tâche terminée')
            ->greeting('Bonjour ' . $notifiable->name)
            ->line($this->employee->name . ' a terminé la tâche : ' . $this->task->title)
            ->line('Consultez les détails dans votre tableau de bord.');
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            //
        ];
    }
}
