import { Component, EventEmitter, Input, Output, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-color-picker-dialog',
  templateUrl: './color-picker-dialog.component.html',
  styleUrls: ['./color-picker-dialog.component.css']
})
export class ColorPickerDialogComponent implements AfterViewInit {
  @Input() selectedColor: string = '';
  @Output() colorSelected = new EventEmitter<string>();
  @ViewChild('colorInput') colorInput!: ElementRef;

  ngAfterViewInit() {
    if (this.colorInput) {
      this.triggerColorPicker();
    }
  }

  triggerColorPicker() {
    console.log('Triggering color picker');
    this.colorInput.nativeElement.click();
  }

  selectColor(event: Event) {
    const input = event.target as HTMLInputElement;
    const color = input.value;
    console.log('Selected color:', color);
    this.colorSelected.emit(color);
  }
}
