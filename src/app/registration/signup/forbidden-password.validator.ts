import { FormGroup } from '@angular/forms';

// custom validator to check that two fields match
export function ForbiddenPassword(controlName: string, firstName: string, lastName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const controlValue = control.value;
    const firstNameControl = formGroup.controls[firstName];
    const lastNameControl = formGroup.controls[lastName];

    // set error on matchingControl if validation fails
    if (controlValue.includes(firstNameControl.value) || controlValue.includes(lastNameControl.value)) {
      control.setErrors({ forbiddenPassword: true });
    } else {
      control.setErrors(null);
    }
  };
}
