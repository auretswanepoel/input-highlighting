import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputHighlightComponent } from './component/input-highlight.component';
import { TextInputHighlightContainerDirective } from './directive/input-container.directive';
import { TextInputElementDirective } from './directive';
import { MentionModule } from 'angular-mentions';

@NgModule({
  declarations: [
    InputHighlightComponent,
    TextInputHighlightContainerDirective,
    TextInputElementDirective,
  ],
  imports: [CommonModule, MentionModule],
  exports: [
    InputHighlightComponent,
    TextInputHighlightContainerDirective,
    TextInputElementDirective,
  ],
})
export class InputHighlightModule {}
