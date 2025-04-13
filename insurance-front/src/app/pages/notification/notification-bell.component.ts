import { Component, OnInit, OnDestroy, HostListener, Input } from '@angular/core';
import { NotificationService, TowingNotification } from '../../services/notification.service';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-notification-bell',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification-bell.component.html',
  styleUrls: ['./notification-bell.component.scss']
})
export class NotificationBellComponent implements OnInit, OnDestroy {
  showDropdown = false;
  notificationCount = 0;
  notifications: TowingNotification[] = [];
  private subscription: Subscription = new Subscription();
  @Input() agentMode = true; // By default, show notifications for the current agent
  @Input() showAllAgents = false; // New property to control showing all agents' notifications

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Subscribe to notifications
    this.subscription.add(
      this.notificationService.notifications$.subscribe(notifications => {
        if (this.showAllAgents) {
          // Show all notifications
          this.notifications = notifications;
        } else {
          // Filter notifications for current agent if in agent mode
          const currentAgentId = this.authService.agent?.idAgent;
          if (this.agentMode && currentAgentId) {
            this.notifications = notifications.filter(n => n.agentId === currentAgentId);
          } else {
            this.notifications = notifications;
          }
        }
        this.notificationCount = this.agentMode 
          ? this.notifications.filter(n => !n.read).length 
          : this.notificationService.getUnreadCount();
      })
    );

    // Initial load
    this.loadNotifications();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscription.unsubscribe();
  }

  loadNotifications(): void {
    if (this.showAllAgents) {
      this.notificationService.loadAllNotifications();
    } else {
      this.notificationService.loadNotifications();
    }
  }

  toggleDropdown(): void {
    this.showDropdown = !this.showDropdown;
    
    // If opening the dropdown, mark notifications as read
    if (this.showDropdown && this.notifications.length > 0) {
      setTimeout(() => {
        this.notifications.forEach(notification => {
          if (!notification.read) {
            this.markAsRead(notification);
          }
        });
      }, 2000); // Mark as read after 2 seconds of viewing
    }
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event): void {
    const element = event.target as HTMLElement;
    if (!element.closest('.notification-container')) {
      this.showDropdown = false;
    }
  }

  markAsRead(notification: TowingNotification): void {
    this.notificationService.markAsRead(notification.id);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  getNotificationIcon(notification: TowingNotification): string {
    switch (notification.status) {
      case 'new':
        return 'fa fa-truck';
      case 'in-progress':
        return 'fa fa-spinner fa-spin';
      case 'completed':
        return 'fa fa-check-circle';
      default:
        return 'fa fa-bell';
    }
  }

  getFormattedTime(date: Date): string {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) {
      return 'Just now';
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes} min${diffInMinutes > 1 ? 's' : ''} ago`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
    }
    
    return date.toLocaleDateString();
  }
  
  // Check if we have any notifications
  hasNotifications(): boolean {
    return this.notifications.length > 0;
  }
  
  // Get notification text with colored policy number
  getNotificationText(notification: TowingNotification): string {
    // Extract policy number from the message
    const policyNumber = notification.policyNumber;
    let message = notification.message;
    
    if (policyNumber && message.includes(policyNumber)) {
      message = message.replace(policyNumber, `<strong class="policy-number">${policyNumber}</strong>`);
    }
    
    return message;
  }
} 