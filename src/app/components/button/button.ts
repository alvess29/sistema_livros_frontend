import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  styleUrl: './button.css',
  templateUrl: './button.html',
})
export class Button {
  @Input() textButton: string;
  @Input() size: string = 'auto';
  @Input() disabled = false;
}
