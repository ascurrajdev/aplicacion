import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appNumberOnly]'
})

export class NumberOnlyDirective {
    @Input() onEnter: Function;

    // Allow decimal numbers. The \. is only allowed once to occur
    // private regex: RegExp = new RegExp(/^[0-9]+(\.[0-9]*){0,1}$/g);
    private regex: RegExp = new RegExp(/^[0-9]+$/g);

    // Allow key codes for special events. Reflect :
    // Backspace, tab, end, home
    private specialKeys: Array<string> = [ 'Backspace', 'Tab', 'End', 'Home', 'ArrowLeft', 'ArrowRight' ];

    constructor(private el: ElementRef) { }

    @HostListener('keydown', [ '$event' ])
    onKeyDown(event: KeyboardEvent) {
        const {key} = event;
        // Do not use event.keycode this is deprecated.
        // See: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
        const current: string = this.el.nativeElement.value;

        // Allow Backspace, tab, end, and home keys
        if (this.specialKeys.indexOf(key) !== -1) {
          return;
        } else if (key === 'Enter' && typeof this.onEnter === 'function') {
          this.onEnter(this.el.nativeElement);
        }

        // We need this because the current value on the DOM element
        // is not yet updated with the value from this event
        const next: string = current.concat(event.key);
        if (next && !String(next).match(this.regex)) {
            event.preventDefault();
        }
    }
}
