import { RegistrationService } from './../registration.service';
import { User } from './../../models/user';
import { HttpClientModule } from '@angular/common/http';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ReactiveFormsModule } from '@angular/forms';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { throwError, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let signupEl;
  let registrationServiceSpy;
  const user: User = {
    firstName: 'fn',
    lastName: 'ln',
    email: 'em@i.l'
  };
  const mockSignupFormFields: User = {
    firstName: 'fn',
    lastName: 'ln',
    email: 'em@i.l',
    password: 'passwordmin8char'
  };

  beforeEach(async(() => {
    const registrationService = jasmine.createSpyObj('RegistrationService', ['register']);
    // Make the spy return a synchronous Observable with the test data
    registrationServiceSpy = registrationService.register.and.returnValue(of(user));

    TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [
        CommonModule,
        HttpClientModule,
        MatInputModule,
        MatFormFieldModule,
        MatIconModule,
        MatButtonModule,
        MatCardModule,
        MatSnackBarModule,
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: RegistrationService, useValue: registrationService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupComponent);
    component = fixture.componentInstance;
    signupEl = fixture.nativeElement.querySelector('.twain');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.signupForm.valid).toBeFalsy();
  });

  Object.keys(mockSignupFormFields).forEach(formControlKey => {
    it(`${formControlKey} field validity`, () => {
      let formControl = component.signupForm.controls[formControlKey];
      expect(formControl.valid).toBeFalsy();
    });
  });

  Object.keys(mockSignupFormFields).forEach(formControlKey => {
    it(`${formControlKey} field validity required`, () => {
      let formControl = component.signupForm.controls[formControlKey];
      const { errors } = formControl || {};
      expect(errors['required']).toBeTruthy();
    });
  });

  it('form fields validity', () => {
    Object.keys(mockSignupFormFields).forEach(formControlKey => {
      let formControl = component.signupForm.controls[formControlKey];
      formControl.setValue(mockSignupFormFields[formControlKey]);
      expect(formControl.valid).toBeTruthy();
    });
  });

  it('email should be valid', () => {
    const emailFormControl = component.signupForm.controls['email'];
    emailFormControl.setValue('asdf');
    expect(emailFormControl.valid).toBeFalsy();
    expect(emailFormControl.errors.email).toBeTruthy();
  });

  it('password should not contain firstname or lastname', () => {
    component.signupForm.controls['firstName'].setValue('first');
    component.signupForm.controls['lastName'].setValue('last');
    const passwordFormControl = component.signupForm.controls['password'];
    passwordFormControl.setValue('first');
    expect(passwordFormControl.valid).toBeFalsy();
    expect(passwordFormControl.errors.forbiddenPassword).toBeTruthy();
    passwordFormControl.setValue('last');
    expect(passwordFormControl.valid).toBeFalsy();
    expect(passwordFormControl.errors.forbiddenPassword).toBeTruthy();
    passwordFormControl.setValue('firstlast');
    expect(passwordFormControl.valid).toBeFalsy();
    expect(passwordFormControl.errors.forbiddenPassword).toBeTruthy();
    passwordFormControl.setValue('lastfirst');
    expect(passwordFormControl.valid).toBeFalsy();
    expect(passwordFormControl.errors.forbiddenPassword).toBeTruthy();
    passwordFormControl.setValue('min');
    expect(passwordFormControl.valid).toBeFalsy();
    expect(passwordFormControl.errors.minlength).toBeTruthy();
    passwordFormControl.setValue('minpasswordchar');
    expect(passwordFormControl.valid).toBeTruthy();
  });

  it('should submit form', () => {
    Object.keys(mockSignupFormFields).forEach(formControlKey => {
      let formControl = component.signupForm.controls[formControlKey];
      formControl.setValue(mockSignupFormFields[formControlKey]);
      expect(formControl.valid).toBeTruthy();
    });
  });

  it('should not call register method of registration service on init', () => {
    fixture.detectChanges(); // onInit()
    expect(registrationServiceSpy.calls.any()).toBe(false, 'register called');
  });
  it('submitting a form emits a user', () => {
    expect(component.signupForm.valid).toBeFalsy();
    Object.keys(mockSignupFormFields).forEach(formControlKey => {
      component.signupForm.controls[formControlKey].setValue(mockSignupFormFields[formControlKey]);
    });

    expect(component.signupForm.valid).toBeTruthy();

    component.submitSignupForm();

    expect(registrationServiceSpy.calls.any()).toBe(true, 'register called');
  });
  // it('should display error when TwainService fails', fakeAsync(() => {
  //   // tell spy to return an error observable
  //   getQuoteSpy.and.returnValue(
  //     throwError('TwainService test failure'));

  //   fixture.detectChanges(); // onInit()
  //   // sync spy errors immediately after init

  //   tick(); // flush the component's setTimeout()

  //   fixture.detectChanges(); // update errorMessage within setTimeout()

  //   expect(errorMessage()).toMatch(/test failure/, 'should display error');
  //   expect(quoteEl.textContent).toBe('...', 'should show placeholder');
  // }));
});
