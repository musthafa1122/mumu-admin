import {Component} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {MaterialModule} from "../../../../material.module";

@Component({
  selector: 'app-bystander-service-form',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    CommonModule
  ],
  templateUrl: './bystander-service-form.component.html',
  styleUrl: './bystander-service-form.component.scss'
})
export class BystanderServiceFormComponent {
  bystanderServiceTypes = [
    {label: "Hospital Bystander", value: "hospitalBystander"},
    {label: "Home Care Bystander", value: "homeCareBystander"},
    {label: "Elderly Caregiver", value: "elderlyCaregiver"},
    {label: "Disabled Caregiver", value: "disabledCaregiver"},
    {label: "Child Care Bystander", value: "childCareBystander"},
    {label: "Post-Surgery Care", value: "postSurgeryCare"}
  ];

  genderPreferences = [
    {label: "Male", value: "male"},
    {label: "Female", value: "female"},
    {label: "No Preference", value: "noPreference"}
  ];

  durations = [
    {label: "Hourly", value: "hourly"},
    {label: "Daily", value: "daily"},
    {label: "Weekly", value: "weekly"},
    {label: "Monthly", value: "monthly"}
  ];

  specialRequirements = [
    {label: "CPR Certified", value: "cprCertified"},
    {label: "Lifting Assistance", value: "liftingAssistance"},
    {label: "Medication Administration", value: "medicationAdministration"},
    {label: "Dementia Care", value: "dementiaCare"}
  ];

  // Define the form
  bystanderForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.bystanderForm = this.fb.group({
      serviceType: ['', Validators.required],
      genderPreference: ['', Validators.required],
      duration: ['', Validators.required],
      specialRequirements: [[]],
      location: ['', Validators.required]
    });
  }

  submitBystanderForm() {
    if (this.bystanderForm.valid) {
      const bystanderData = this.bystanderForm.value;
      console.log('Bystander Service Request:', bystanderData);
      // Handle bystander service request submission
    }
  }
}
