import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { INFO } from '../../data/info';

@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './bio.html',
  styleUrl: './bio.scss',
})
export class Bio {
  private fb = inject(FormBuilder);
  protected readonly profile = INFO.profile;
  protected readonly links = INFO.links;
  protected readonly stack = Object.values(INFO.skills).flat().slice(0, 6).join(' · ');

  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  formSubmitted = false;
  submitting = false;

  submitMessage() {
    if (this.contactForm.valid) {
      this.submitting = true;
      setTimeout(() => {
        this.submitting = false;
        this.formSubmitted = true;
        this.contactForm.reset();
        setTimeout(() => { this.formSubmitted = false; }, 3000);
      }, 1500);
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
