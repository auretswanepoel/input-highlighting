import { Directive } from '@angular/core';

@Directive({
  selector: 'textarea[textInputElement]',
  host: {
    '[class.text-input-element]': 'true',
  },
})
export class TextInputElementDirective {}
