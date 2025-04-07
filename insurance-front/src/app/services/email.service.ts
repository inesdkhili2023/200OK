import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

interface EmailRequest {
  to: string;
  subject: string;
  body: string;
}

@Injectable({
  providedIn: 'root'
})
export class EmailService {
  private apiUrl = 'http://localhost:9090';

  constructor(private http: HttpClient) { }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  // Send notification email when claim status is updated
  sendClaimUpdateEmail(userEmail: string, userName: string, claimId: number, claimStatus: string): Observable<any> {
    const headers = this.getHeaders();
    
    // For now, we'll log the email that would be sent
    // In production, this would call an actual email API endpoint
    const emailData: EmailRequest = {
      to: userEmail,
      subject: `Your Claim #${claimId} Status Has Been Updated`,
      body: this.buildClaimUpdateEmailBody(userName, claimId, claimStatus)
    };
    
    console.log('Sending email notification:', emailData);
    
    // Return simulated success response for now
    // In a real implementation, this would use an actual API endpoint:
    // return this.http.post(${this.apiUrl}/email/send, emailData, { headers });
    
    return new Observable(observer => {
      setTimeout(() => {
        observer.next({ success: true, message: 'Email notification sent' });
        observer.complete();
      }, 500);
    });
  }
  
  // Helper method to build email body
  private buildClaimUpdateEmailBody(userName: string, claimId: number, claimStatus: string): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 10px;">
        <div style="background: linear-gradient(135deg, #455a70, #3e4e63); padding: 20px; color: white; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0;">Claim Status Update</h1>
        </div>
        
        <div style="padding: 20px;">
          <p>Hello ${userName},</p>
          
          <p>Your claim <strong>#${claimId}</strong> has been updated by an administrator.</p>
          
          <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-size: 16px;">
              Your claim status is now: 
              <span style="font-weight: bold; color: ${this.getStatusColor(claimStatus)};">${claimStatus}</span>
            </p>
          </div>
          
          <p>You can view the details of your claim by logging into your account and visiting the claims section.</p>
          
          <p>If you have any questions about this update, please don't hesitate to contact our support team.</p>
          
          <p>Best regards,<br>The InsurancePress Team</p>
        </div>
        
        <div style="background-color: #f1f5f9; padding: 15px; text-align: center; font-size: 12px; color: #64748b; border-radius: 0 0 10px 10px;">
          <p>This is an automated message, please do not reply directly to this email.</p>
        </div>
      </div>
    `;
  }
  
  // Helper method to get status color for email
  private getStatusColor(status: string): string {
    switch (status) {
      case 'UNTREATED':
        return '#f59e0b'; // Amber
      case 'INPROGRESS':
        return '#3b82f6'; // Blue
      case 'TREATED':
        return '#10b981'; // Green
      default:
        return '#64748b'; // Gray
    }
  }
}