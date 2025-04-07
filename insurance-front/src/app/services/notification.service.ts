import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Notification {
  id: number;
  userId: number;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  timestamp: Date;
  data?: any; // Optional additional data (like claim ID)
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications = new BehaviorSubject<Notification[]>([]);
  private storageKey = 'user_notifications';

  constructor() {
    this.loadNotifications();
  }

  // Get all notifications for the current user
  getNotifications(userId: number): Observable<Notification[]> {
    return new Observable(observer => {
      // Filter notifications for this user
      const userNotifications = this.notifications.value
        .filter(notification => notification.userId === userId)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      observer.next(userNotifications);
      observer.complete();
    });
  }

  // Get unread count for the current user
  getUnreadCount(userId: number): Observable<number> {
    return new Observable(observer => {
      const count = this.notifications.value
        .filter(notification => notification.userId === userId && !notification.isRead)
        .length;
      
      observer.next(count);
      observer.complete();
    });
  }

  // Add a new notification
  addNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'isRead'>): void {
    const currentNotifications = this.notifications.value;
    const newNotification: Notification = {
      ...notification,
      id: Date.now(), // Simple ID generation
      timestamp: new Date(),
      isRead: false
    };

    const updatedNotifications = [...currentNotifications, newNotification];
    this.notifications.next(updatedNotifications);
    this.saveNotifications();
  }

  // Mark a notification as read
  markAsRead(notificationId: number): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    );

    this.notifications.next(updatedNotifications);
    this.saveNotifications();
  }

  // Mark all notifications as read for a user
  markAllAsRead(userId: number): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.map(notification => 
      notification.userId === userId 
        ? { ...notification, isRead: true }
        : notification
    );

    this.notifications.next(updatedNotifications);
    this.saveNotifications();
  }

  // Remove a notification
  removeNotification(notificationId: number): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.filter(
      notification => notification.id !== notificationId
    );

    this.notifications.next(updatedNotifications);
    this.saveNotifications();
  }

  // Clear all notifications for a user
  clearAllNotifications(userId: number): void {
    const currentNotifications = this.notifications.value;
    const updatedNotifications = currentNotifications.filter(
      notification => notification.userId !== userId
    );

    this.notifications.next(updatedNotifications);
    this.saveNotifications();
  }

  // For admin: notify user of claim update
  notifyClaimUpdate(userId: number, claimId: number, claimStatus: string): void {
    this.addNotification({
      userId,
      message: `Your claim #${claimId} has been updated to status: ${claimStatus}`,
      type: 'info',
      data: { claimId }
    });
  }

  // Private methods
  private loadNotifications(): void {
    const storedNotifications = localStorage.getItem(this.storageKey);
    if (storedNotifications) {
      try {
        const notifications = JSON.parse(storedNotifications);
        // Convert string timestamps back to Date objects
        const formattedNotifications = notifications.map((notification: any) => ({
          ...notification,
          timestamp: new Date(notification.timestamp)
        }));
        this.notifications.next(formattedNotifications);
      } catch (error) {
        console.error('Error loading notifications from storage:', error);
        this.notifications.next([]);
      }
    }
  }

  private saveNotifications(): void {
    localStorage.setItem(this.storageKey, JSON.stringify(this.notifications.value));
  }
}