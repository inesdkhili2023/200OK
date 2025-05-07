import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotificationService, TowingNotification } from '../../services/notification.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-all-notifications',
  templateUrl: './all-notifications.component.html',
  styleUrls: ['./all-notifications.component.css']
})
export class AllNotificationsComponent implements OnInit, OnDestroy {
  notifications: TowingNotification[] = [];
  private subscription: Subscription = new Subscription();
  loading: boolean = true;
  selectedNotification: TowingNotification | null = null;
  
  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loading = true;
    this.subscription.add(
      this.notificationService.notifications$.subscribe(notifications => {
        this.notifications = notifications;
        this.loading = false;
      })
    );

    // Load all notifications
    this.notificationService.loadAllNotifications();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }
  
  markAsRead(notification: TowingNotification): void {
    this.notificationService.markAsRead(notification.id);
  }
  
  viewNotificationDetails(notification: TowingNotification): void {
    this.selectedNotification = notification;
  }
  
  closeDetails(): void {
    this.selectedNotification = null;
  }
  
  getFormattedDate(date: Date): string {
    return new Date(date).toLocaleString();
  }
  
  getStatusClass(status: string): string {
    switch(status) {
      case 'new': return 'status-new';
      case 'in-progress': return 'status-in-progress';
      case 'completed': return 'status-completed';
      default: return '';
    }
  }
} 