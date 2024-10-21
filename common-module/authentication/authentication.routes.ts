import {Routes} from '@angular/router';

import {AppSideLoginComponent} from './side-login/side-login.component';
import {AppSideRegisterComponent} from './side-register/side-register.component';
import {OtpVerificationComponent} from "../../../components/otp-verification/otp-verification.component";

export const AuthenticationRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'login',
        component: AppSideLoginComponent,
      },
      {
        path: 'register',
        component: AppSideRegisterComponent,
      },
      {
        path: 'otp-verification',
        component: OtpVerificationComponent,

      }
    ],
  },
];
