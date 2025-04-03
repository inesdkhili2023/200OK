import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

declare var gapi: any;

@Injectable({
  providedIn: 'root'
})
export class GoogleCalendarService {
  private CLIENT_ID = '247289513383-8aee7278b1atk4svh80cajcddsirjhjl.apps.googleusercontent.com';
  private API_KEY = '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';
  private SCOPES = 'https://www.googleapis.com/auth/calendar';

  constructor(private http: HttpClient) {}

  // Initialize the gapi client
  public initClient(): void {
    gapi.client.init({
      apiKey: this.API_KEY,
      clientId: this.CLIENT_ID,
      discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      scope: this.SCOPES
    }).then(() => {
      console.log('Google API client initialized');
    });
  }

  // Sign-in the user to authenticate with Google
  public signIn(): Promise<any> {
    return gapi.auth2.getAuthInstance().signIn();
  }

  // Sign-out the user
  public signOut(): void {
    gapi.auth2.getAuthInstance().signOut();
  }

  // Create a new event in Google Calendar
  public createEvent(event: any): Observable<any> {
    const eventResource = {
      'summary': event.summary,
      'location': event.location,
      'description': event.description,
      'start': {
        'dateTime': event.startTime,
        'timeZone': event.timeZone,
      },
      'end': {
        'dateTime': event.endTime,
        'timeZone': event.timeZone,
      },
      'attendees': event.attendees,
    };

    return this.http.post(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events`,
      eventResource,
      {
        headers: {
          Authorization: `Bearer ${gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().access_token}`
        }
      }
    );
  }
}
