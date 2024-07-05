import { Component, OnInit, ViewChild, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ColorPickerDialogComponent } from '../color-picker-dialog/color-picker-dialog.component';

@Component({
  selector: 'app-task1',
  templateUrl: './task1.component.html',
  styleUrls: ['./task1.component.css']
})
export class Task1Component implements OnInit {
  @ViewChild('overlayContainer', { read: ViewContainerRef }) overlayContainer!: ViewContainerRef;

  colors: string[] = [];
  svgContent: string = '';
  svgUrl: string = '/assets/images/study.svg';
  svgDoc: Document | null = null;
  selectedColor: string = '#000000';

  constructor(
    private http: HttpClient,
    private componentFactoryResolver: ComponentFactoryResolver
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
      console.log('Extracted colors:', this.colors);
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

    this.colors = Array.from(colorSet);
    console.log('Extract colors:', this.colors);
  }

  openColorPicker(originalColor: string) {
    if (this.overlayContainer) {
      this.overlayContainer.clear();

      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(ColorPickerDialogComponent);
      const componentRef = this.overlayContainer.createComponent(componentFactory);

    
      componentRef.instance.color = originalColor;

      componentRef.instance.colorSelected.subscribe((selectedColor: string) => {
        this.updateSvgColor(originalColor, selectedColor);
      });
    } else {
      console.error('Overlay container not found');
    }
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
    // Implement download logic here
  }

  shareSvg() {
    // Implement share logic here
  }
}
