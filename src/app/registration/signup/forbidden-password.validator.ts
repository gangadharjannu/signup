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
      // Fix for accidentally overriding all remaining errors
      // https://stackoverflow.com/questions/45069629/angular-abstract-control-remove-error
      control.setErrors({ ...control.errors, forbiddenPassword: true });
    } else {
      if (Object.keys(control.errors || {}).length === 0) {
        control.setErrors(null);
      } else {
        delete control.errors.forbiddenPassword;
        control.setErrors({ ...control.errors });
      }
    }
  };
}
