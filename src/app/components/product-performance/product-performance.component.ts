import {Component, OnInit} from '@angular/core';
import {NgApexchartsModule} from 'ng-apexcharts';
import {TablerIconsModule} from 'angular-tabler-icons';
import {CommonModule} from '@angular/common';
import {MaterialModule} from "../../material.module";

interface JobData {
  jobId: number;
  jobTitle: string;
  company: string;
  location: string;
  datePosted: string;
  salary: number;
  jobType: string;
  duration: string;
  skillsRequired: string;
  status: string;
  imageUrl?: string;
}

const ELEMENT_DATA: JobData[] = [
  {
    jobId: 1,
    jobTitle: 'Plumber',
    company: 'Fix-It Services',
    location: 'New Delhi, India',
    datePosted: '2024-09-25',
    salary: 1500,
    jobType: 'Contract',
    duration: '2 Days',
    skillsRequired: 'Plumbing, Pipe Fitting',
    status: 'Available',
    imageUrl: 'assets/images/products/s4.jpg',
  },
  {
    jobId: 2,
    jobTitle: 'Electrician',
    company: 'Power Solutions Ltd',
    location: 'Mumbai, India',
    datePosted: '2024-09-28',
    salary: 2000,
    jobType: 'Full-time',
    duration: 'Permanent',
    skillsRequired: 'Electrical Wiring, Circuit Troubleshooting',
    status: 'In Progress',
    imageUrl: 'assets/images/products/s5.jpg',

  },
  {
    jobId: 3,
    jobTitle: 'Driver',
    company: 'SafeDrive Rentals',
    location: 'Bangalore, India',
    datePosted: '2024-09-30',
    salary: 1200,
    jobType: 'Part-time',
    duration: '1 Week',
    skillsRequired: 'Driving License, Knowledge of City Routes',
    status: 'Available',
    imageUrl: 'assets/images/products/s6.jpg',

  },
  {
    jobId: 4,
    jobTitle: 'Carpenter',
    company: 'WoodWorks Inc.',
    location: 'Chennai, India',
    datePosted: '2024-10-01',
    salary: 1800,
    jobType: 'Freelance',
    duration: '3 Days',
    skillsRequired: 'Wood Cutting, Furniture Assembly',
    status: 'Completed',
    imageUrl: 'assets/images/products/s7.jpg',

  },
  {
    jobId: 5,
    jobTitle: 'House Cleaner',
    company: 'CleanIt Pro',
    location: 'Hyderabad, India',
    datePosted: '2024-09-27',
    salary: 1000,
    jobType: 'Part-time',
    duration: '1 Day',
    skillsRequired: 'House Cleaning, Organization',
    status: 'Available',
    imageUrl: 'assets/images/products/s9.jpg',

  },
  {
    jobId: 6,
    jobTitle: 'AC Technician',
    company: 'Cooling Experts',
    location: 'Kolkata, India',
    datePosted: '2024-09-29',
    salary: 2200,
    jobType: 'Contract',
    duration: '2 Days',
    skillsRequired: 'AC Installation, Maintenance',
    status: 'Available',
    imageUrl: 'assets/images/products/s11.jpg',

  },
  {
    jobId: 7,
    jobTitle: 'Gardener',
    company: 'GreenThumb Services',
    location: 'Pune, India',
    datePosted: '2024-09-26',
    salary: 900,
    jobType: 'Freelance',
    duration: '3 Hours',
    skillsRequired: 'Plant Care, Landscaping',
    status: 'Completed',
    imageUrl: 'assets/images/products/s4.jpg',

  },
  {
    jobId: 8,
    jobTitle: 'Painter',
    company: 'ColorMyWorld',
    location: 'Delhi, India',
    datePosted: '2024-09-30',
    salary: 2000,
    jobType: 'Contract',
    duration: '5 Days',
    skillsRequired: 'Wall Painting, Priming',
    status: 'Available',
    imageUrl: 'assets/images/products/s5.jpg',

  },
  {
    jobId: 9,
    jobTitle: 'Cook',
    company: 'FoodMasters',
    location: 'Lucknow, India',
    datePosted: '2024-10-01',
    salary: 1700,
    jobType: 'Part-time',
    duration: '4 Hours',
    skillsRequired: 'Cooking, Recipe Development',
    status: 'Available',
    imageUrl: 'assets/images/products/s7.jpg',

  },
  {
    jobId: 10,
    jobTitle: 'Babysitter',
    company: 'CareTakers Ltd',
    location: 'Gurgaon, India',
    datePosted: '2024-09-27',
    salary: 1200,
    jobType: 'Freelance',
    duration: '1 Day',
    skillsRequired: 'Childcare, First Aid',
    status: 'Completed',
    imageUrl: 'assets/images/products/s6.jpg',

  },
  {
    jobId: 11,
    jobTitle: 'Mechanic',
    company: 'AutoFixers',
    location: 'Chandigarh, India',
    datePosted: '2024-09-28',
    salary: 2500,
    jobType: 'Full-time',
    duration: 'Permanent',
    skillsRequired: 'Vehicle Repair, Diagnostics',
    status: 'In Progress',
    imageUrl: 'assets/images/products/s9.jpg',

  },
  {
    jobId: 12,
    jobTitle: 'Security Guard',
    company: 'SecureItNow',
    location: 'Noida, India',
    datePosted: '2024-09-30',
    salary: 1800,
    jobType: 'Contract',
    duration: '1 Month',
    skillsRequired: 'Surveillance, Patrolling',
    status: 'Available',
    imageUrl: 'assets/images/products/s11.jpg',

  },
  {
    jobId: 13,
    jobTitle: 'Tutor',
    company: 'EduMaster',
    location: 'Ahmedabad, India',
    datePosted: '2024-10-01',
    salary: 1500,
    jobType: 'Freelance',
    duration: '2 Hours/Day',
    skillsRequired: 'Teaching, Subject Expertise',
    status: 'Available',
    imageUrl: 'assets/images/products/s4.jpg',

  },
  {
    jobId: 14,
    jobTitle: 'Pet Sitter',
    company: 'Paws & Claws Care',
    location: 'Bhopal, India',
    datePosted: '2024-09-25',
    salary: 800,
    jobType: 'Part-time',
    duration: '1 Day',
    skillsRequired: 'Pet Care, Feeding',
    status: 'Completed',
    imageUrl: 'assets/images/products/s5.jpg',

  },
  {
    jobId: 15,
    jobTitle: 'Mason',
    company: 'BuildIt Solutions',
    location: 'Nagpur, India',
    datePosted: '2024-09-28',
    salary: 2300,
    jobType: 'Contract',
    duration: '3 Days',
    skillsRequired: 'Brick Laying, Cement Work',
    status: 'In Progress',
    imageUrl: 'assets/images/products/s6.jpg',

  },
  {
    jobId: 16,
    jobTitle: 'Delivery Boy',
    company: 'QuickDeliver',
    location: 'Indore, India',
    datePosted: '2024-09-29',
    salary: 900,
    jobType: 'Part-time',
    duration: '1 Day',
    skillsRequired: 'Driving, Package Handling',
    status: 'Available',
    imageUrl: 'assets/images/products/s7.jpg',

  },
  {
    jobId: 17,
    jobTitle: 'Welder',
    company: 'MetalWorks Ltd',
    location: 'Patna, India',
    datePosted: '2024-09-27',
    salary: 2100,
    jobType: 'Contract',
    duration: '4 Days',
    skillsRequired: 'Welding, Metalwork',
    status: 'Available',
    imageUrl: 'assets/images/products/s9.jpg',

  },
  {
    jobId: 18,
    jobTitle: 'Tailor',
    company: 'StitchUp',
    location: 'Jaipur, India',
    datePosted: '2024-09-30',
    salary: 1600,
    jobType: 'Freelance',
    duration: '2 Days',
    skillsRequired: 'Sewing, Alterations',
    status: 'In Progress',
    imageUrl: 'assets/images/products/s11.jpg',

  },
  {
    jobId: 19,
    jobTitle: 'House Painter',
    company: 'HomeColors',
    location: 'Surat, India',
    datePosted: '2024-09-28',
    salary: 2200,
    jobType: 'Contract',
    duration: '4 Days',
    skillsRequired: 'Painting, Surface Preparation',
    status: 'Available',
    imageUrl: 'assets/images/products/s4.jpg',

  },
  {
    jobId: 20,
    jobTitle: 'IT Support Technician',
    company: 'TechSupport India',
    location: 'Thane, India',
    datePosted: '2024-10-01',
    salary: 2500,
    jobType: 'Full-time',
    duration: 'Permanent',
    skillsRequired: 'Troubleshooting, System Maintenance',
    status: 'Available',
    imageUrl: 'assets/images/products/s5.jpg',

  }
];

@Component({
  selector: 'app-product-performance',
  standalone: true,
  imports: [
    NgApexchartsModule,
    MaterialModule,
    TablerIconsModule,
    CommonModule,
  ],
  templateUrl: './product-performance.component.html',
})
export class AppProductPerformanceComponent implements OnInit {

  displayedColumns: string[] = [
    'image',
    'jobTitle',      // Title or name of the job
    'client',       // The company or client offering the job
    'location',      // Job location
    'datePosted',    // The date the job was posted
    'salary',        // Salary or payment for the job
    'jobType',       // Type of job (e.g., Full-time, Part-time, Contract)
    'duration',      // Duration of the job (if applicable)
    'action'         // Action column for applying or selecting the job
  ];
  dataSource = ELEMENT_DATA;


  months: { value: string, viewValue: string }[] = [];


  ngOnInit(): void {

    this.generateMonths()
  };

  generateMonths() {
    const monthNames: string[] = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    monthNames.forEach((monthName, index) => {
      const date: Date = new Date(2023, index);
      this.months.push({
        value: date.toLocaleString('en', {month: 'short'}).toLowerCase(), // e.g., 'jan'
        viewValue: `${monthName}`
      });
    });
  }

  applyForJob(jobId: number): void {
    console.log(`Applying for job with ID: ${jobId}`);
    // You can add your logic here, e.g., open a dialog, send a request to a server, etc.
  }


}
