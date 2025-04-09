import { Component } from '@angular/core';

@Component({
  selector: 'app-towing-request',
  template: `
    <section class="towing-request-section">
      <div class="container py-5">
        <div class="row">
          <div class="col-lg-8 mx-auto">
            <div class="card shadow border-0">
              <div class="card-header bg-primary text-white">
                <h2 class="mb-0"><i class="fas fa-truck-pickup me-2"></i>Emergency Towing Service</h2>
              </div>
              <div class="card-body">
                <div class="text-center mb-4">
                  <h3>Scan QR Code for Immediate Assistance</h3>
                  <p class="text-muted">Use your phone camera to scan this code when you need immediate roadside assistance</p>
                </div>
                
                <div class="row align-items-center">
                  <div class="col-md-6">
                    <div class="p-4">
                      <app-qr-code></app-qr-code>
                    </div>
                  </div>
                  <div class="col-md-6">
                    <h4><i class="fas fa-check-circle text-success me-2"></i>How It Works</h4>
                    <ul class="list-unstyled">
                      <li class="mb-2"><i class="fas fa-angle-right me-2 text-primary"></i> Scan the QR code with your phone</li>
                      <li class="mb-2"><i class="fas fa-angle-right me-2 text-primary"></i> Your location is automatically detected</li>
                      <li class="mb-2"><i class="fas fa-angle-right me-2 text-primary"></i> Emergency request is sent immediately</li>
                      <li class="mb-2"><i class="fas fa-angle-right me-2 text-primary"></i> Nearest available agent is dispatched</li>
                      <li class="mb-2"><i class="fas fa-angle-right me-2 text-primary"></i> Track your assistance request in real-time</li>
                    </ul>
                  </div>
                </div>
                
                <div class="alert alert-info mt-4">
                  <div class="d-flex align-items-center">
                    <i class="fas fa-info-circle fs-4 me-3"></i>
                    <div>
                      <strong>Emergency Assistance Hotline:</strong> For direct assistance, call our 24/7 emergency line at 
                      <a href="tel:+1234567890" class="alert-link">123-456-7890</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .towing-request-section {
      background-color: #f8f9fa;
      min-height: 100vh;
      padding: 40px 0;
    }
    .card {
      border-radius: 15px;
      overflow: hidden;
    }
    .card-header {
      border-bottom: 0;
    }
    h2, h3, h4 {
      font-weight: 600;
    }
    .list-unstyled li {
      padding: 8px 0;
    }
    .alert-info {
      background-color: #e8f4f8;
      border-color: #d6e9f0;
      color: #0c5460;
    }
  `]
})
export class TowingRequestComponent {
  constructor() { }
} 