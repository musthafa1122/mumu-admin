import {Component} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators,} from '@angular/forms';
import {Router, RouterModule} from '@angular/router';
import {MaterialModule} from '../../../material.module';
import {MatButtonModule} from '@angular/material/button';
import {AuthService} from "@auth0/auth0-angular";

@Component({
  selector: 'app-side-login',
  standalone: true,
  imports: [
    RouterModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './side-login.component.html',
})
export class AppSideLoginComponent {
  form = new FormGroup({
    uname: new FormControl('', [Validators.required, Validators.minLength(6)]),
    password: new FormControl('', [Validators.required]),
  });

  constructor(private router: Router, public authService: AuthService,) {
  }

  get f() {
    return this.form.controls;
  }

  submit() {

    this.authService.loginWithPopup().subscribe(data => {
      this.router.navigate(['/dashboard']);
    })
    // this.router.navigate(['/']);
  }
}
