import { Directive } from '@angular/core';

@Directive({
  selector: '[textInputHighlightContainer]',
  host: {
    '[class.text-input-highlight-container]': 'true',
  },
})
export class TextInputHighlightContainerDirective {}
