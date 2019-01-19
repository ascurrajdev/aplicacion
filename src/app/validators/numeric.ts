import { AbstractControl, ValidatorFn } from '@angular/forms';

export default function numericValidator(): ValidatorFn {
    return (control: AbstractControl): {[key: string]: any} | null => {
        const {value: v} = control;
        // const is_numeric =  !isNaN(parseFloat(v)) && isFinite(v);
        // return !is_numeric ? {'numeric': {value: v}} : null;
        return /^(\+|\-)?([\d]{1,3}\.)?[\d]+(\,[\d]+)?$/g.test(v) ? null : {'numeric': {value: v}};
    };
}
