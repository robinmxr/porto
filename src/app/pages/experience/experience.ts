import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { INFO } from '../../data/info';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './experience.html',
  styleUrl: './experience.scss',
})
export class Experience {
  protected readonly profile = INFO.profile;
  protected readonly experience = INFO.experience;
}
