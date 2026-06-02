import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, interval, Subscription } from 'rxjs';
import { Auth } from '@angular/fire/auth';

export interface NotificationConfig {
  preferredStudyTime: 'manana' | 'tarde' | 'noche' | 'ninguno';
  notificationIntensity: 'baja' | 'normal' | 'alta';
  notificationsEnabled: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSubscription?: Subscription;
  private notificationPermissionGranted$ = new BehaviorSubject<boolean>(false);
  private auth = inject(Auth);

  constructor() {
    this.checkNotificationPermission();
  }

  /**
   * Verifica si el navegador soporta notificaciones y si el usuario ha dado permiso
   */
  private checkNotificationPermission(): void {
    if (!('Notification' in window)) {
      return;
    }

    if (Notification.permission === 'granted') {
      this.notificationPermissionGranted$.next(true);
    }
  }

  /**
   * Solicita permiso al usuario para enviar notificaciones
   */
  async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      return false;
    }

    if (Notification.permission === 'granted') {
      this.notificationPermissionGranted$.next(true);
      return true;
    }

    if (Notification.permission !== 'denied') {
      try {
        const permission = await Notification.requestPermission();
        const granted = permission === 'granted';
        this.notificationPermissionGranted$.next(granted);
        return granted;
      } catch (error) {
        console.error('Error al solicitar permiso de notificaciones:', error);
        return false;
      }
    }

    return false;
  }

  /**
   * Inicia el sistema de recordatorios según la configuración
   */
  async startReminders(config: NotificationConfig, userInitiated = false): Promise<void> {
    // Detener recordatorios previos
    this.stopReminders();

    if (!config.notificationsEnabled) {
      return;
    }

    // Solicitar permiso si no está concedido y es iniciado por el usuario
    if (!this.notificationPermissionGranted$.value) {
      if (userInitiated) {
        const granted = await this.requestPermission();
        if (!granted) {
          console.warn('Permiso de notificaciones denegado');
          return;
        }
      } else {
        return;
      }
    }

    // Iniciar chequeo cada minuto
    this.notificationSubscription = interval(60000).subscribe(() => {
      this.checkAndNotify(config);
    });

    // Chequear inmediatamente al iniciar
    this.checkAndNotify(config);
  }

  /**
   * Detiene los recordatorios
   */
  stopReminders(): void {
    if (this.notificationSubscription) {
      this.notificationSubscription.unsubscribe();
    }
  }

  /**
   * Chequea si es momento de enviar notificación según horario e intensidad
   */
  private checkAndNotify(config: NotificationConfig): void {
    const now = new Date();
    const hour = now.getHours();
    const minute = now.getMinutes();

    // Determinar ventana de horario
    let shouldNotify = false;
    const timeKey = `${hour}:${String(minute).padStart(2, '0')}`;

    // Definir ventanas de tiempo: mañana (7-11), tarde (14-18), noche (20-23)
    const timeWindows: Record<NotificationConfig['preferredStudyTime'], [number, number]> = {
      manana: [7, 11],
      tarde: [14, 18],
      noche: [20, 23],
      ninguno: [8, 22]
    };

    const [startHour, endHour] = timeWindows[config.preferredStudyTime];

    // Revisar si estamos dentro de la ventana del horario preferido
    if (hour >= startHour && hour < endHour) {
      shouldNotify = true;
    }

    if (!shouldNotify) {
      return;
    }

    const user = this.auth.currentUser;
    if (user) {
      const streakRaw = localStorage.getItem(`estudiauni_streak_${user.uid}`);
      if (streakRaw) {
        try {
          const streak = JSON.parse(streakRaw);
          const d = new Date();
          const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
          if (streak.lastDate === todayStr) {
            return; // El usuario ya estudió hoy, no notificar
          }
        } catch(e) {}
      }
    }

    // Calcular frecuencia según intensidad
    const frequencyMinutes: Record<NotificationConfig['notificationIntensity'], number> = {
      baja: 90, // Cada hora y media
      normal: 60, // Cada hora
      alta: 30, // Cada 30 minutos
    };

    const frequency = frequencyMinutes[config.notificationIntensity];
    const lastNotificationKey = 'lastStudyNotification';
    const lastNotification = localStorage.getItem(lastNotificationKey);
    const lastTime = lastNotification ? parseInt(lastNotification) : 0;
    const now_ms = Date.now();

    // Chequear si ha pasado el tiempo mínimo desde la última notificación
    if (now_ms - lastTime < frequency * 60 * 1000) {
      return;
    }

    // Enviar notificación
    this.sendNotification();
    localStorage.setItem(lastNotificationKey, String(now_ms));
  }

  /**
   * Envía una notificación al usuario
   */
  private sendNotification(): void {
    const messages = [
      '¿Quieres estudiar un poco? 📚',
      'Es hora de ponerse a estudiar 🚀',
      'No olvides tu meta de estudio hoy ⏰',
      'Vamos, tu objetivo te espera 🎯',
      'Dedica tiempo a tu preparación 💪',
    ];

    const randomMessage = messages[Math.floor(Math.random() * messages.length)];

    try {
      new Notification('EstudiaUni', {
        body: randomMessage,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: 'study-reminder',
        requireInteraction: false,
      });
    } catch (error) {
      console.error('Error al enviar notificación:', error);
    }
  }

  /**
   * Obtiene el estado actual de permiso de notificaciones
   */
  isNotificationPermissionGranted(): boolean {
    return this.notificationPermissionGranted$.value;
  }
}
