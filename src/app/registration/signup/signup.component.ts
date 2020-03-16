import { User } from './../../models/user';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

import * as signupFormConstants from './../registration.constants';
// import custom validator to validate that password and confirm password fields match
import { ForbiddenPassword } from './forbidden-password.validator';
import { RegistrationService } from './../registration.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  submitted = false;
  hide = true;
  signupFormConstants = signupFormConstants;
  constructor(private fb: FormBuilder, private snackBar: MatSnackBar, private registerService: RegistrationService) { }

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(signupFormConstants.PASSWORD_MIN_LENGTH)]]
    }, {
      validator: ForbiddenPassword('password', 'firstName', 'lastName')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  submitSignupForm(): void {
    this.submitted = true;
    // stop here if form is invalid
    if (this.signupForm.invalid) {
      return;
    }
    const payload: User = { ...this.signupForm.value };
    delete payload.password;

    this.registerService.register(payload).pipe(first())
      .subscribe(
        data => {
          this.snackBar.open('Registration successful', 'Close', { duration: 3000 });
        },
        error => {
          this.snackBar.open('Registration failed', 'Close', { duration: 5000 });
        });
  }


  getFirstNameErrorMessage() {
    if (this.f.firstName.hasError('required')) {
      return 'You must enter a value';
    }

    return this.f.firstName.hasError('firstName') ? 'Not a valid firstName' : '';
  }

  getLastNameErrorMessage() {
    if (this.f.lastName.hasError('required')) {
      return 'You must enter a value';
    }

    return this.f.lastName.hasError('lastName') ? 'Not a valid lastName' : '';
  }

  getEmailErrorMessage() {
    if (this.f.email.hasError('required')) {
      return 'You must enter a value';
    }

    return this.f.email.hasError('email') ? 'Not a valid email' : '';
  }
  getPasswordErrorMessage() {
    if (this.f.password.hasError('required')) {
      return 'You must enter a value';
    }
    if (this.f.password.hasError('minlength')) {
      return 'Password should be at least 8 characters length';
    }
    if (this.f.password.hasError('forbiddenPassword')) {
      return 'Password should not contain first name or last name';
    }
    return this.f.password.hasError('password') ? 'Not a valid password' : '';
  }
}
