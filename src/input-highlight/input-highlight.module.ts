import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputHighlightComponent } from './component/input-highlight.component';
import { TextInputHighlightContainerDirective } from './directive/input-container.directive';
import { TextInputElementDirective } from './directive';

@NgModule({
  declarations: [
    InputHighlightComponent,
    TextInputHighlightContainerDirective,
    TextInputElementDirective,
  ],
  imports: [CommonModule],
  exports: [
    InputHighlightComponent,
    TextInputHighlightContainerDirective,
    TextInputElementDirective,
  ],
})
export class InputHighlightModule {}
