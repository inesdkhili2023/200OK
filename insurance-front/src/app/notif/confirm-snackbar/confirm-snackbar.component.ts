import { Component, Inject } from '@angular/core';
import { MatSnackBarRef, MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';

@Component({
  selector: 'app-confirm-snackbar',
  template: `
    <div class="snack-container">
      <p class="message">{{ data.message }}</p>
      <div class="actions">
        <button mat-button color="primary" (click)="confirm()">Oui</button>
        <button mat-button color="warn" (click)="cancel()">Non</button>
      </div>
    </div>
  `,
  styles: [`
    .snack-container {
      padding: 16px;
      text-align: center;
      width: 100%;
      horizontalPosition: 'center';
      verticalPosition: 'top';
    }
    .message {
      font-size: 18px;
      margin-bottom: 12px;
    }
    .actions {
      display: flex;
      justify-content: center;
      gap: 20px;
    }
  `]
})
export class ConfirmSnackbarComponent {
  constructor(
    public snackBarRef: MatSnackBarRef<ConfirmSnackbarComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: { message: string }
  ) {}

  confirm() {
    this.snackBarRef.dismissWithAction();
  }

  cancel() {
    this.snackBarRef.dismiss();
  }
}
