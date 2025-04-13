import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NotificationService, TowingNotification } from '../../services/notification.service';
import { Subscription } from 'rxjs';
import { NotificationBellComponent } from '../notification/notification-bell.component';

@Component({
  selector: 'app-all-notifications',
  standalone: true,
  imports: [CommonModule, FormsModule, NotificationBellComponent],
  templateUrl: './all-notifications.component.html',
  styleUrls: ['./all-notifications.component.css']
})
export class AllNotificationsComponent implements OnInit, OnDestroy {
  notifications: TowingNotification[] = [];
  filteredNotifications: TowingNotification[] = [];
  statusFilter: string = 'all';
  agentFilter: string = 'all';
  private subscription: Subscription = new Subscription();
  
  uniqueAgentIds: number[] = [];
  
  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    // Subscribe to notifications
    this.subscription.add(
      this.notificationService.notifications$.subscribe(notifications => {
        this.notifications = notifications;
        this.filteredNotifications = [...notifications];
        this.extractUniqueAgentIds();
        this.applyFilters();
      })
    );
    
    // Load all notifications
    this.notificationService.loadAllNotifications();
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
  
  private extractUniqueAgentIds(): void {
    this.uniqueAgentIds = [...new Set(
      this.notifications
        .filter(notification => notification.agentId !== undefined)
        .map(notification => notification.agentId!)
    )];
  }
  
  applyFilters(): void {
    this.filteredNotifications = this.notifications.filter(notification => {
      // Apply status filter
      if (this.statusFilter !== 'all' && notification.status !== this.statusFilter) {
        return false;
      }
      
      // Apply agent filter
      if (this.agentFilter !== 'all' && notification.agentId !== parseInt(this.agentFilter, 10)) {
        return false;
      }
      
      return true;
    });
  }
  
  setStatusFilter(status: string): void {
    this.statusFilter = status;
    this.applyFilters();
  }
  
  setAgentFilter(agentId: string): void {
    this.agentFilter = agentId;
    this.applyFilters();
  }
  
  refreshNotifications(): void {
    this.notificationService.loadAllNotifications();
  }
  
  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }
  
  formatDate(date: Date): string {
    return new Date(date).toLocaleString();
  }
  
  getStatusClass(status: string): string {
    switch (status) {
      case 'new': return 'badge-primary';
      case 'in-progress': return 'badge-warning';
      case 'completed': return 'badge-success';
      default: return 'badge-secondary';
    }
  }
} 