import {Component} from '@angular/core';
import {UserComponent} from "../../components/user/user.component";

@Component({
  selector: 'app-service-details',
  standalone: true,
  imports: [
    UserComponent
  ],
  templateUrl: './service-details.component.html',
  styleUrl: './service-details.component.scss'
})
export class ServiceDetailsComponent {

}
