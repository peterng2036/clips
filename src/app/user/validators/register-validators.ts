import { ValidationErrors, AbstractControl, ValidatorFn } from '@angular/forms';
export class RegisterValidators {
  static match(controlName: string, matchingControlname: string): ValidatorFn {
    return (group: AbstractControl): ValidationErrors | null => {
      const control = group.get(controlName);
      const matchingControl = group.get(matchingControlname);

      if (!control || !matchingControl) {
        console.error('Form controls cannot be found in the formgorup');
        return { controlNotFound: false };
      }

      const error =
        control.value === matchingControl.value ? null : { noMatch: true };

      matchingControl.setErrors(error);

      return error;
    };
  }
}
