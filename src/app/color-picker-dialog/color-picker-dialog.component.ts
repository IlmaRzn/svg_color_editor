import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-color-picker-dialog',
  templateUrl: './color-picker-dialog.component.html',
  styleUrls: ['./color-picker-dialog.component.css']
})
export class ColorPickerDialogComponent {
  selectedColor: string;

  constructor(
    public dialogRef: MatDialogRef<ColorPickerDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { selectedColor: string }
  ) {
    this.selectedColor = data.selectedColor;
  }

  setColor(color: string) {
    this.selectedColor = color;
  }

  closeDialog() {
    this.dialogRef.close(this.selectedColor);
  }
}
