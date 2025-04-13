import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, interval, of } from 'rxjs';
import { tap, switchMap, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';

export interface TowingNotification {
  id: string;
  message: string;
  policyNumber: string;
  date: Date;
  read: boolean;
  status: 'new' | 'in-progress' | 'completed';
  agentId?: number;
  towingId?: number;
  location?: string;
  latitude?: number;
  longitude?: number;
  userRating?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private _notifications = new BehaviorSubject<TowingNotification[]>([]);
  public readonly notifications$ = this._notifications.asObservable();

  private apiUrl = `${environment.apiBaseUrl}/notifications`;
  private pollingSubscription: any;
  private hasBackendError = false;

  constructor(private http: HttpClient, private authService: AuthService) {
    // Initialize with data
    this.loadNotifications();
    
    // Set up polling every 30 seconds
    this.setupPolling();
  }

  private setupPolling() {
    // Poll for new notifications every 30 seconds
    this.pollingSubscription = interval(30000).subscribe(() => {
      this.loadNotifications();
    });
  }

  loadNotifications(): void {
    const agent = this.authService.agent;
    const agentId = agent?.idAgent;
    
    if (!agent && this._notifications.value.length > 0 && this.hasBackendError) {
      return;
    }
    
    // Determine which endpoint to use based on whether we need all notifications or just for this agent
    let url = this.apiUrl;
    if (agentId !== undefined) {
      // Only get notifications for this agent from the endpoint
      url = `${this.apiUrl}?agentId=${agentId}`;
    } else {
      // Get all notifications when no specific agent is logged in or when we need all notifications
      url = `${this.apiUrl}`;
    }

    console.log(`Loading notifications from: ${url}`);

    this.http.get<any[]>(url)
      .pipe(
        tap((notifications) => {
          this.hasBackendError = false;
          console.log('Received notifications:', notifications);
          if (notifications && notifications.length) {
            const formattedNotifications: TowingNotification[] = notifications.map(n => ({
              id: n.id || '',
              message: n.message || 'No message content',
              policyNumber: n.policyNumber || 'N/A',
              date: new Date(n.date || new Date()),
              read: !!n.read,
              status: n.status as 'new' | 'in-progress' | 'completed' || 'new',
              agentId: n.agentId,
              towingId: n.towingId,
              location: n.location,
              latitude: n.latitude,
              longitude: n.longitude,
              userRating: n.userRating
            }));
            this._notifications.next(formattedNotifications);
          } else {
            this._notifications.next([]);
          }
        }),
        catchError(error => {
          this.hasBackendError = true;
          console.error('Error loading notifications:', error);
          
          // If we already have notifications loaded, just keep them
          if (this._notifications.value.length > 0) {
            return of(this._notifications.value);
          }
          
          // Generate mock data relevant to the current agent if possible
          const mockNotifications: TowingNotification[] = this.generateMockNotifications(agentId);
          this._notifications.next(mockNotifications);
          return of(mockNotifications);
        })
      ).subscribe();
  }
  
  private generateMockNotifications(agentId?: number): TowingNotification[] {
    const baseNotifications = [
      {
        id: '1',
        message: 'New towing request for policy',
        policyNumber: 'POL-123456',
        date: new Date(Date.now() - 3600000), // 1 hour ago
        read: false,
        status: 'new' as 'new'
      },
      {
        id: '2',
        message: 'Towing service in progress for policy',
        policyNumber: 'POL-234567',
        date: new Date(Date.now() - 86400000), // 1 day ago
        read: false,
        status: 'in-progress' as 'in-progress'
      },
      {
        id: '3',
        message: 'Towing service completed for policy',
        policyNumber: 'POL-345678',
        date: new Date(Date.now() - 259200000), // 3 days ago
        read: true,
        status: 'completed' as 'completed'
      }
    ];
    
    // If agent ID is provided, assign it to the mock notifications and create agent-specific policy numbers
    if (agentId) {
      return baseNotifications.map((notification, index) => ({
        ...notification,
        agentId,
        id: `${agentId}-${index + 1}`,
        policyNumber: `POL-${agentId}${index + 1}000${index + 1}`,
        message: `${notification.message} ${notification.policyNumber} (assigned to you)`
      }));
    }
    
    return baseNotifications;
  }

  getUnreadCount(): number {
    return this._notifications.value.filter(n => !n.read).length;
  }

  markAsRead(id: string): void {
    const currentNotifications = this._notifications.value;
    const updatedNotifications = currentNotifications.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    );
    
    this._notifications.next(updatedNotifications);
    
    if (!this.hasBackendError) {
      this.http.post(`${this.apiUrl}/${id}/read`, {}).subscribe({
        error: (error) => {
          console.error('Error marking notification as read:', error);
          this.hasBackendError = true;
        }
      });
    }
  }

  markAllAsRead(): void {
    const currentNotifications = this._notifications.value;
    const updatedNotifications = currentNotifications.map(notification => 
      ({ ...notification, read: true })
    );
    this._notifications.next(updatedNotifications);
    
    // Don't try to update the server if we know there's a backend error
    if (this.hasBackendError) {
      return;
    }
    
    // Update each notification on the server
    const markRequests = currentNotifications
      .filter(n => !n.read)
      .map(n => this.http.post(`${this.apiUrl}/${n.id}/read`, {}));
    
    if (markRequests.length) {
      // Execute all requests
      of(markRequests).pipe(
        switchMap(requests => {
          // If there are no requests, return empty array
          if (requests.length === 0) return of([]);
          return of(requests).pipe(
            // Execute each request
            switchMap(reqs => {
              const responses = reqs.map(req => req.pipe(
                catchError(error => {
                  console.error('Error marking notification as read:', error);
                  this.hasBackendError = true;
                  return of(null);
                })
              ));
              return of(responses);
            })
          );
        })
      ).subscribe();
    }
  }

  // New method to handle towing status updates
  updateTowingStatus(towingId: number, status: 'new' | 'in-progress' | 'completed', location?: string): void {
    if (this.hasBackendError) return;

    const payload = {
      towingId,
      status,
      location,
      date: new Date()
    };

    this.http.post(`${this.apiUrl}/towing-status`, payload).subscribe({
      next: () => this.loadNotifications(),
      error: (error) => console.error('Error updating towing status:', error)
    });
  }

  // Add a new method to load all notifications regardless of agent
  loadAllNotifications(): void {
    // Just call the main API endpoint without any agent ID filter
    this.http.get<any[]>(this.apiUrl)
      .pipe(
        tap((notifications) => {
          this.hasBackendError = false;
          if (notifications && notifications.length) {
            const formattedNotifications: TowingNotification[] = notifications.map(n => ({
              id: n.id || '',
              message: n.message || 'No message content',
              policyNumber: n.policyNumber || 'N/A',
              date: new Date(n.date || new Date()),
              read: !!n.read,
              status: n.status as 'new' | 'in-progress' | 'completed' || 'new',
              agentId: n.agentId,
              towingId: n.towingId,
              location: n.location,
              latitude: n.latitude,
              longitude: n.longitude,
              userRating: n.userRating
            }));
            this._notifications.next(formattedNotifications);
          } else {
            this._notifications.next([]);
          }
        }),
        catchError(error => {
          this.hasBackendError = true;
          console.error('Error loading all notifications:', error);
          return of(this._notifications.value);
        })
      ).subscribe();
  }

  ngOnDestroy() {
    // Clean up polling subscription
    if (this.pollingSubscription) {
      this.pollingSubscription.unsubscribe();
    }
  }
} 