import {Component} from '@angular/core';
import {MaterialModule} from "../../../../material.module";
import {NgApexchartsModule} from "ng-apexcharts";

@Component({
  selector: 'app-price-confirmation-popup',
  standalone: true,
  imports: [MaterialModule, NgApexchartsModule],
  templateUrl: './price-confirmation-popup.component.html',
  styleUrl: './price-confirmation-popup.component.scss'
})
export class PriceConfirmationPopupComponent {

}
