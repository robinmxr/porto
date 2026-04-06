import { Component, inject } from '@angular/core';
import { ViewportService } from '../../viewport.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.html',
  styles: ``,
})
export class Projects {
  protected readonly viewport = inject(ViewportService);
}
