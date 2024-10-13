import {Component} from '@angular/core';
import {CommonModule, DatePipe, NgClass} from "@angular/common";
import {MatCard} from "@angular/material/card";
import {MaterialModule} from "../../../material.module";
import {BrandingComponent} from "../../../layouts/full/sidebar/branding.component";
import {NotificationComponent} from "../../ui-components/notification/notification.component";
import {TablerIconsModule} from "angular-tabler-icons";
import {JobProposalHelper} from "../../job-proposals/job-proposals.helper";
import {MatTabBody, MatTabHeader} from "@angular/material/tabs";
import {AppRecentTransactionsComponent} from "../../../components/recent-transactions/recent-transactions.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {JobProposalsComponent} from "../../job-proposals/job-proposals.component";

@Component({
  selector: 'app-worker-profile',
  standalone: true,
  imports: [
    MaterialModule,
    NgClass,
    DatePipe,
    CommonModule,
    MatCard,
    BrandingComponent,
    NotificationComponent,
    TablerIconsModule,
    MatTabHeader,
    MatTabBody,
    AppRecentTransactionsComponent,
    FormsModule,
    JobProposalsComponent,
    ReactiveFormsModule
  ],
  templateUrl: './worker-profile.component.html',
  styleUrl: './worker-profile.component.scss'

})
export class WorkerProfileComponent {
  user = {
    id: "12345",
    name: "John Doe",
    profilePic: "https://via.placeholder.com/120",
    email: "john.doe@example.com",
    phoneNumber: "+1234567890",
    rating: 4.5,
    verified: true,
    location: "New York, USA",
    dob: "1990-05-12",
    gender: "Male",
    documents: [
      {
        icon: 'id-card',
        title: 'Aadhaar Verification',
        description: 'Image Verification for Aadhaar',
        status: 'Pending'
      },
      {
        icon: 'id-card',
        title: 'PAN Verification',
        description: 'Image Verification for PAN',
        status: 'Verified'
      },
      {
        icon: 'passport',
        title: 'Passport Verification',
        description: 'Face-to-Face Verification scheduled for 2024-10-15',
        status: 'Scheduled'
      },
      {
        icon: 'calendar',
        title: 'Age Verification',
        description: 'Image Verification for Age',
        status: 'Verified'
      }
    ],
    history: [
      {
        title: "Driver Service",
        date: "2023-09-10",
        description: "Drove a client to a destination for an urgent appointment."
      },
      {
        title: "Errand Service",
        date: "2023-08-25",
        description: "Picked up groceries for a customer."
      }
    ],
    reviews: [
      {
        reviewer: "Jane Smith",
        comment: "Great driver, very punctual!",
        rating: 5
      },
      {
        reviewer: "David Green",
        comment: "Helped with errands efficiently.",
        rating: 4
      },
      {
        reviewer: "Emily Johnson",
        comment: "Very polite and professional.",
        rating: 5
      },
      {
        reviewer: "Michael Brown",
        comment: "Arrived a bit late, but did a good job.",
        rating: 3
      },
      {
        reviewer: "Sophia Martinez",
        comment: "Exceptional service, will hire again!",
        rating: 5
      },
      {
        reviewer: "Christopher Wilson",
        comment: "Communication could be better.",
        rating: 3
      },
      {
        reviewer: "Isabella Lee",
        comment: "Task completed quickly and accurately.",
        rating: 4
      },
      {
        reviewer: "Daniel Garcia",
        comment: "Good work, but a bit expensive.",
        rating: 3
      },
      {
        reviewer: "Olivia Rodriguez",
        comment: "Super helpful, highly recommended.",
        rating: 5
      },
      {
        reviewer: "James Davis",
        comment: "Friendly and efficient service.",
        rating: 4
      },
      {
        reviewer: "Mia Anderson",
        comment: "Could have done better with time management.",
        rating: 3
      },
      {
        reviewer: "Lucas White",
        comment: "Great experience overall.",
        rating: 5
      },
      {
        reviewer: "Grace Taylor",
        comment: "Was a bit slow, but did a thorough job.",
        rating: 4
      },
      {
        reviewer: "Benjamin Thomas",
        comment: "Not satisfied with the communication.",
        rating: 2
      },
      {
        reviewer: "Ava Hernandez",
        comment: "On time and very courteous.",
        rating: 5
      }
    ],
    additionalDetails: {
      joinDate: "2022-03-15",
      serviceCount: 52,
      averageResponseTime: "15 mins"
    }
  }
  protected readonly document = document;

  constructor(private jobProposalHelper: JobProposalHelper) {
  }

  getStars(rating: number): string[] {
    return this.jobProposalHelper.getStars(rating);
  }
}
