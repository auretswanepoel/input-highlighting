import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { InputHighlightModule } from '../input-highlight/input-highlight.module';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
import { MentionModule } from 'angular-mentions';

@NgModule({
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    InputHighlightModule,
    AngularMaterialModule,
    MentionModule,
  ],
  declarations: [AppComponent, HelloComponent],
  bootstrap: [AppComponent],
})
export class AppModule {}
