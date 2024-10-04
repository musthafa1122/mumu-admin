import {Component} from '@angular/core';
import {MaterialModule} from "../../../material.module";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'app-errands-service-form',
  standalone: true,
  imports: [MaterialModule,
    ReactiveFormsModule,
    CommonModule],
  templateUrl: './errands-service-form.component.html',
  styleUrl: './errands-service-form.component.scss'
})
export class ErrandsServiceFormComponent {
  errandServiceTypes = [
    {label: "Grocery Shopping", value: "groceryShopping"},
    {label: "Package Pickup", value: "packagePickup"},
    {label: "Bill Payment", value: "billPayment"},
    {label: "Other", value: "other"}
  ];

  priorityLevels = [
    {label: "Low", value: "low"},
    {label: "Medium", value: "medium"},
    {label: "High", value: "high"}
  ];

  durations = [
    {label: "Hourly", value: "hourly"},
    {label: "Daily", value: "daily"},
    {label: "Weekly", value: "weekly"}
  ];

  additionalNotes = [
    {label: "Fragile Items", value: "fragileItems"},
    {label: "Perishable Items", value: "perishableItems"},
    {label: "Special Handling Required", value: "specialHandlingRequired"}
  ];

  // Define the form
  errandForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.errandForm = this.fb.group({
      serviceType: ['', Validators.required],
      priorityLevel: ['', Validators.required],
      duration: ['', Validators.required],
      additionalNotes: [[]],
      location: ['', Validators.required]
    });
  }

  submitErrandForm() {
    if (this.errandForm.valid) {
      const errandData = this.errandForm.value;
      console.log('Errand Service Request:', errandData);
      // Handle errand service request submission
    }
  }
}
