import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from 'src/app/services/notification.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  unreadCount: number = 0;
  isDropdownOpen: boolean = false;
  currentUserId: number | null = null;
  private subscription: Subscription = new Subscription();

  constructor(
    private notificationService: NotificationService,
    private userService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the current user ID
    this.currentUserId = this.userService.getCurrentUserId();
    
    if (this.currentUserId) {
      // Load notifications for the current user
      this.loadNotifications();
      
      // Refresh notifications every 60 seconds
      const refreshInterval = setInterval(() => {
        if (this.currentUserId) {
          this.loadNotifications();
        }
      }, 60000);
      
      // Store the interval for cleanup
      this.subscription.add(() => clearInterval(refreshInterval));
    }
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.subscription.unsubscribe();
  }

  loadNotifications(): void {
    if (!this.currentUserId) return;

    // Get notifications
    this.subscription.add(
      this.notificationService.getNotifications(this.currentUserId).subscribe(
        notifications => {
          this.notifications = notifications;
        }
      )
    );

    // Get unread count
    this.subscription.add(
      this.notificationService.getUnreadCount(this.currentUserId).subscribe(
        count => {
          this.unreadCount = count;
        }
      )
    );
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  closeDropdown(): void {
    this.isDropdownOpen = false;
  }

  markAsRead(notification: Notification): void {
    this.notificationService.markAsRead(notification.id);
    this.loadNotifications();
  }

  markAllAsRead(): void {
    if (this.currentUserId) {
      this.notificationService.markAllAsRead(this.currentUserId);
      this.loadNotifications();
    }
  }

  clearAll(): void {
    if (this.currentUserId) {
      this.notificationService.clearAllNotifications(this.currentUserId);
      this.loadNotifications();
    }
  }

  goToNotification(notification: Notification): void {
    this.markAsRead(notification);
    
    // Navigate based on notification type/data
    if (notification.data && notification.data.claimId) {
      this.router.navigate(['/claim-list']);
    }
    
    this.closeDropdown();
  }

  getTimeAgo(date: Date): string {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffSecs = Math.round(diffMs / 1000);
    const diffMins = Math.round(diffSecs / 60);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);

    if (diffSecs < 60) {
      return `${diffSecs} second${diffSecs !== 1 ? 's' : ''} ago`;
    } else if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    }
  }
}