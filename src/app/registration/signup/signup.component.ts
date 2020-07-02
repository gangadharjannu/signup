import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { first } from 'rxjs/operators';
import { User } from './../../models/user';
import * as signupFormConstants from './../registration.constants';
import { RegistrationService } from './../registration.service';
// import custom validator to validate that password and confirm password fields match
import { ForbiddenPassword } from './forbidden-password.validator';

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
    // initialize signup form with validations using form builder
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(signupFormConstants.PASSWORD_MIN_LENGTH)]]
    }, {
      // ForbiddenPassword accepts the property keys or restricted passwords
      validator: ForbiddenPassword('password', 'firstName', 'lastName')
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.signupForm.controls; }

  /**
   * method to execute when user submits the form
   * registers the user using register service only if the form is valid
   */
  submitSignupForm(): void {
    this.submitted = true;
    // Don't register the user if the form is invalid
    if (this.signupForm.invalid) {
      return;
    }
    const { payload, password:_ } = this.signupForm.value;

    // register the user
    this.registerService.register(payload).pipe(first())
      .subscribe(
        data => {
          this.snackBar.open(
            signupFormConstants.USER_REGISTRATION_SUCCESSFUL,
            signupFormConstants.USER_REGISTRATION_ALERT_CLOSE,
            { duration: signupFormConstants.SUCCESSFUL_MSG_DURATION }
          );
        },
        error => {
          this.snackBar.open(
            signupFormConstants.USER_REGISTRATION_FAIL,
            signupFormConstants.USER_REGISTRATION_ALERT_CLOSE,
            { duration: signupFormConstants.FAILURE_MSG_DURATION }
          );
        });
  }

  /**
   * helper methods to get error messages for form fields
  */

  getFirstNameErrorMessage() {
    if (this.f.firstName.hasError('required')) {
      return signupFormConstants.REQUIRED_VALIDATION_MSG;
    }
  }

  getLastNameErrorMessage() {
    if (this.f.lastName.hasError('required')) {
      return signupFormConstants.REQUIRED_VALIDATION_MSG;
    }
  }

  getEmailErrorMessage() {
    if (this.f.email.hasError('required')) {
      return signupFormConstants.REQUIRED_VALIDATION_MSG;
    }

    return this.f.email.hasError('email') ? signupFormConstants.INVALID_EMAIL_MSG : '';
  }

  getPasswordErrorMessage() {
    if (this.f.password.hasError('required')) {
      return signupFormConstants.REQUIRED_VALIDATION_MSG;
    }
    if (this.f.password.hasError('minlength')) {
      return signupFormConstants.PASSWORD_MIN_LENGTH_VALIDATION_MSG;
    }
    if (this.f.password.hasError('forbiddenPassword')) {
      return signupFormConstants.PASSWORD_FORBIDDEN_VALIDATION_MSG;
    }
  }
}
