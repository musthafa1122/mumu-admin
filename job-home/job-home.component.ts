import {Component} from '@angular/core';
import {JobListingComponent} from "./job-listing/job-listing.component";
import {AppRecentTransactionsComponent} from "../../components/recent-transactions/recent-transactions.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {
  GoogleMapSearchBoxComponent
} from "../../components/google-map/google-map-search-box/google-map-search-box.component";
import {MatButton, MatMiniFabButton} from "@angular/material/button";
import {MatCard, MatCardContent, MatCardFooter, MatCardSubtitle, MatCardTitle} from "@angular/material/card";
import {MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from "@angular/material/datepicker";
import {MatFormField, MatLabel, MatSuffix} from "@angular/material/form-field";
import {MatIcon} from "@angular/material/icon";
import {MatInput} from "@angular/material/input";
import {MatOption} from "@angular/material/core";
import {MatSelect} from "@angular/material/select";
import {MatTab, MatTabGroup, MatTabLabel} from "@angular/material/tabs";
import {NgForOf, NgIf} from "@angular/common";
import {TablerIconsModule} from "angular-tabler-icons";
import {MatBadge} from "@angular/material/badge";

@Component({
  selector: 'app-job-home',
  standalone: true,
  imports: [
    JobListingComponent,
    AppRecentTransactionsComponent,
    FormsModule,
    GoogleMapSearchBoxComponent,
    MatButton,
    MatCard,
    MatCardContent,
    MatCardFooter,
    MatCardSubtitle,
    MatCardTitle,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatIcon,
    MatInput,
    MatLabel,
    MatMiniFabButton,
    MatOption,
    MatSelect,
    MatSuffix,
    MatTab,
    MatTabGroup,
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    TablerIconsModule,
    MatTabLabel,
    MatBadge
  ],
  templateUrl: './job-home.component.html',
  styleUrl: './job-home.component.scss'
})
export class JobHomeComponent {

}
