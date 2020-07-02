import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs'; // make sure to import the throwError from rxjs
import { User } from './../../models/user';
import { RegistrationService } from './../registration.service';
import { SignupComponent } from './signup.component';
import { PASSWORD_FORBIDDEN_VALIDATION_MSG, PASSWORD_MIN_LENGTH_VALIDATION_MSG } from '../registration.constants';


describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let signupEl;
  let registrationServiceSpy;
  const user: User = {
    firstName: 'firstname',
    lastName: 'lastname',
    email: 'em@i.l'
  };
  const validMockSignupFormFields: User = {
    firstName: 'firstname',
    lastName: 'lastname',
    email: 'em@i.l',
    password: 'passwordmin8char'
  };
  const invalidMockSignupFormFields: User = {
    firstName: '',
    lastName: '',
    email: 'emai.l',
    password: 'passwd'
  };
  const invalidEmailMessage = 'Not a valid email';

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

  Object.keys(validMockSignupFormFields).forEach(formControlKey => {
    it(`${formControlKey} field validity`, () => {
      const formControl = component.signupForm.controls[formControlKey];
      expect(formControl.valid).toBeFalsy();
    });
  });

  Object.keys(validMockSignupFormFields).forEach(formControlKey => {
    it(`${formControlKey} field validity required`, () => {
      const formControl = component.signupForm.controls[formControlKey];
      const { errors } = formControl || {};
      expect(errors.required).toBeTruthy();
    });
  });

  it('check valid values for form fields', () => {
    Object.keys(validMockSignupFormFields).forEach(formControlKey => {
      const formControl = component.signupForm.controls[formControlKey];
      formControl.setValue(validMockSignupFormFields[formControlKey]);
      expect(formControl.valid).toBeTruthy();
    });
  });

  it('check invalid values for form fields', () => {
    Object.keys(validMockSignupFormFields).forEach(formControlKey => {
      const formControl = component.signupForm.controls[formControlKey];
      formControl.setValue(invalidMockSignupFormFields[formControlKey]);
      expect(formControl.valid).toBeFalsy();
    });
  });

  it('email should be valid', () => {
    const emailFormControl = component.signupForm.controls.email;
    emailFormControl.setValue(validMockSignupFormFields.email);
    expect(emailFormControl.valid).toBeTruthy();
    expect(component.getEmailErrorMessage()).toEqual('');
  });

  it('email should be invalid', () => {
    const emailFormControl = component.signupForm.controls.email;
    emailFormControl.setValue(invalidMockSignupFormFields.email);
    expect(emailFormControl.valid).toBeFalsy();
    expect(emailFormControl.errors.email).toBeTruthy();
    expect(component.getEmailErrorMessage()).toEqual(invalidEmailMessage);
  });

  it('password should not contain firstname or lastname', () => {
    const passwordFormControl = component.signupForm.controls.password;

    component.signupForm.controls.firstName.setValue(validMockSignupFormFields.firstName);
    component.signupForm.controls.lastName.setValue(validMockSignupFormFields.lastName);
    passwordFormControl.setValue(validMockSignupFormFields.firstName);

    expect(passwordFormControl.valid).toBeFalsy();
    expect(passwordFormControl.errors.forbiddenPassword).toBeTruthy();
    expect(component.getPasswordErrorMessage()).toEqual(PASSWORD_FORBIDDEN_VALIDATION_MSG);

    passwordFormControl.setValue(validMockSignupFormFields.password);
    expect(passwordFormControl.valid).toBeTruthy();
  });

  it('should show min length error message if the password length is less than min length ', () => {
    const passwordFormControl = component.signupForm.controls.password;
    passwordFormControl.setValue(invalidMockSignupFormFields.password);
    expect(passwordFormControl.valid).toBeFalsy();
    expect(passwordFormControl.errors.minlength).toBeTruthy();
    expect(component.getPasswordErrorMessage()).toEqual(PASSWORD_MIN_LENGTH_VALIDATION_MSG);
  });

  it('should not call register method of registration service on init', () => {
    fixture.detectChanges();
    expect(registrationServiceSpy.calls.any()).toBe(false, 'register called');
  });

  it('should submit form', () => {
    Object.keys(validMockSignupFormFields).forEach(formControlKey => {
      const formControl = component.signupForm.controls[formControlKey];
      formControl.setValue(validMockSignupFormFields[formControlKey]);
      expect(formControl.valid).toBeTruthy();
    });
  });

  it('submitting an invalid form stops creating user', () => {
    expect(component.signupForm.valid).toBeFalsy();
    Object.keys(validMockSignupFormFields).forEach(formControlKey => {
      component.signupForm.controls[formControlKey].setValue(invalidMockSignupFormFields[formControlKey]);
    });

    expect(component.signupForm.valid).toBeFalsy();
    component.submitSignupForm();
    expect(registrationServiceSpy.calls.any()).toBe(false);
  });

  it('submitting a form emits a user', () => {
    expect(component.signupForm.valid).toBeFalsy();
    Object.keys(validMockSignupFormFields).forEach(formControlKey => {
      component.signupForm.controls[formControlKey].setValue(validMockSignupFormFields[formControlKey]);
    });

    expect(component.signupForm.valid).toBeTruthy();
    component.submitSignupForm();
    expect(registrationServiceSpy.calls.any()).toBe(true, 'register called');
  });
});
