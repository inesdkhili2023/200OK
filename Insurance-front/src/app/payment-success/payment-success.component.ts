import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {PaiementService} from '../../app/services/paiement.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-payment-success',
  standalone: true,
  templateUrl: './payment-success.component.html',
  template: `
  <h2>Paiement réussi !</h2>
  <p>Merci pour votre achat.</p>
`

})
export class PaymentSuccessComponent {
    constructor(private route: ActivatedRoute) {
      const paymentIntent = this.route.snapshot.queryParamMap.get('payment_intent');
      console.log('ID de paiement:', paymentIntent);
    }
}