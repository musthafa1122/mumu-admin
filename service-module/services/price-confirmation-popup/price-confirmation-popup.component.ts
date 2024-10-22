import {Component} from '@angular/core';
import {MaterialModule} from "../../../../material.module";
import {NgApexchartsModule} from "ng-apexcharts";
import {NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-price-confirmation-popup',
  standalone: true,
  imports: [MaterialModule, NgApexchartsModule, NgIf],
  templateUrl: './price-confirmation-popup.component.html',
  styleUrl: './price-confirmation-popup.component.scss'
})
export class PriceConfirmationPopupComponent {
  showProgress = false;
  protected readonly onsubmit = onsubmit;

  constructor(private router: Router, private dialog: MatDialog,) {
  }

  submit() {
    this.showProgress = true;
    setTimeout(() => {
      this.showProgress = false
      this.router.navigateByUrl("/service-home/history");
      this.dialog.closeAll()
    }, 7000);
  }
}
