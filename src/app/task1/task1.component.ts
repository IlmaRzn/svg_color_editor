import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { ColorPickerDialogComponent } from '../color-picker-dialog/color-picker-dialog.component';

@Component({
  selector: 'app-task1',
  templateUrl: './task1.component.html',
  styleUrls: ['./task1.component.css']
})
export class Task1Component implements OnInit {
  selectedColor: string = '';
  colors: string[] = [];
  svgContent: string = ''; 
  svgUrl: string = '/assets/images/study.svg'; 
  svgDoc: Document | null = null; 

  constructor(
    private http: HttpClient,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadSvgFromUrl(this.svgUrl);
  }

  loadSvgFromUrl(url: string): void {
    this.http.get(url, { responseType: 'text' }).subscribe(svgContent => {
      const parser = new DOMParser();
      this.svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
      this.svgContent = svgContent;
      this.extractColors(this.svgDoc);
    });
  }

  extractColors(svgDoc: Document): void {
    const styleElements = svgDoc.querySelectorAll('[style]');
    const colorSet = new Set<string>();

    styleElements.forEach(el => {
      const styles = el.getAttribute('style')?.split(';') || [];
      styles.forEach(style => {
        const styleParts = style.split(':');
        if (styleParts.length === 2 && styleParts[0].trim() === 'fill') {
          const color = styleParts[1].trim();
          if (color.startsWith('rgb(')) {
            colorSet.add(color);
          }
        }
      });
    });

    console.log('Extracted colors:', Array.from(colorSet)); 
    this.colors = Array.from(colorSet);
  }

  openColorPicker(color: string) {
    const dialogRef = this.dialog.open(ColorPickerDialogComponent, {
      data: { selectedColor: color }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedColor = result;
        this.updateSvgColor(color, result);
      }
    });
  }

  updateSvgColor(originalColor: string, newColor: string) {
    if (this.svgDoc && newColor) {
      const elementsToUpdate = this.svgDoc.querySelectorAll(`[style*="fill:${originalColor}"]`);
      elementsToUpdate.forEach(element => {
        const styles = element.getAttribute('style')!.split(';').map(style => {
          if (style.includes(`fill:${originalColor}`)) {
            return `fill:${newColor}`;
          }
          return style;
        });
        element.setAttribute('style', styles.join(';'));
      });

      const serializer = new XMLSerializer();
      this.svgContent = serializer.serializeToString(this.svgDoc);
    }
  }

  downloadSvg() {
    // Implement the logic for downloading the SVG
  }

  shareSvg() {
    // Implement the logic for sharing the SVG
  }
}
