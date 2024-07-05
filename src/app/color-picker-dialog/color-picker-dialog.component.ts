import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-color-picker-dialog',
  templateUrl: './color-picker-dialog.component.html',
  styleUrls: ['./color-picker-dialog.component.css']
})
export class ColorPickerDialogComponent {
  color: string = '#000000'; 

  @Output() colorSelected: EventEmitter<string> = new EventEmitter<string>();

  onColorChange(event: any): void {
    this.color = event; 
    this.colorSelected.emit(this.color);
  }
}
