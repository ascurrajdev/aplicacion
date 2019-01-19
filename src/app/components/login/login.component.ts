import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Constants from './../../../custom/Constants';

// import { SocketSubjectNext } from './../../interfaces';
import {NumericValidation} from './../../validators';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css'],
})
export class LoginComponent {

    loginForm = this.fb.group({
        investment: ['', [Validators.required, NumericValidation()]],
        project: ['', [Validators.required]],
        rate: ['', Validators.required],
        currency_id: [1, Validators.required],
        years: [5, Validators.required]
    });

    validationErrorMessages: any = Constants.getValidationErrorMessages();

    constructor(public fb: FormBuilder) { }

    onFormSubmit() {
        const {value: fields} = this.loginForm;
        const payload: any = Object.keys(fields).reduce((acc,k) => {
            const val = fields[k];
            acc[k] = k === 'investment' ? Number(val.replace('.', '')) : val;
            return acc;
        }, {});

        const {currency_id = 1} = payload;

        localStorage.setItem('payload', JSON.stringify(Object.assign({}, payload, {sign: currency_id == 2 ? '₲' : '$'})));
        window.location.href = '/';
    }

    showErrors(errors): string {
        const keys = Object.keys(errors);
        if (!keys.length) { return ''; }
        let response = '';

        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            if (this.validationErrorMessages.hasOwnProperty(k)) {
                response = this.validationErrorMessages[k];
                break;
            }
        }
        return response;
    }
}
