import {Component, Inject, OnInit} from '@angular/core';
import {MaterialModule} from "../../../../material.module";
import {NgApexchartsModule} from "ng-apexcharts";
import {CurrencyPipe, NgIf} from "@angular/common";
import {Router} from "@angular/router";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-price-confirmation-popup',
  standalone: true,
  imports: [MaterialModule, NgApexchartsModule, NgIf, CurrencyPipe, FormsModule],
  templateUrl: './price-confirmation-popup.component.html',
  styleUrl: './price-confirmation-popup.component.scss'
})
export class PriceConfirmationPopupComponent implements OnInit {
  showProgress = false;
  protected readonly onsubmit = onsubmit;

  constructor(private router: Router, private dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: any,
              private dialogRef: MatDialogRef<PriceConfirmationPopupComponent>) {
  }

  ngOnInit(): void {
    console.log(this.data)
  }

  openInfoDialog(templateRef: any): void {
    this.dialog.open(templateRef);
  }


  confirmPrice() {
    this.showProgress = false
    this.dialog.closeAll()
    this.dialogRef.close(this.data);
  }
}
