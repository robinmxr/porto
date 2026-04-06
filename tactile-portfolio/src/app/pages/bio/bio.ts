import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-bio',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './bio.html',
})
export class Bio {
  private fb = inject(FormBuilder);
  
  contactForm: FormGroup = this.fb.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    message: ['', [Validators.required, Validators.minLength(10)]]
  });

  submitMessage() {
    if (this.contactForm.valid) {
      console.log('[SYS_ORCHESTRATOR] Secure Message Transmitted:', this.contactForm.value);
      this.contactForm.reset();
      // Future: connect this payload to PortfolioService / HTTP endpoint
    } else {
      this.contactForm.markAllAsTouched();
    }
  }
}
