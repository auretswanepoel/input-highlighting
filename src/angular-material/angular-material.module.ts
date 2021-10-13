import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatMenuModule,
  ],
  exports: [MatInputModule, MatFormFieldModule, MatMenuModule],
  declarations: [],
})
export class AngularMaterialModule {}
