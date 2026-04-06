import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-glitch-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="active" class="fixed inset-0 z-[100] pointer-events-none overflow-hidden">
      <!-- CRT Scanline Glitch -->
      <div class="absolute inset-x-0 h-[2px] bg-primary/40 shadow-[0_0_20px_#9fa7ff] anim-glitch-scan top-0"></div>
      
      <!-- Static Noise Layer -->
      <div class="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] blend-overlay"></div>
      
      <!-- RGB Split Overlay -->
      <div class="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent animate-pulse"></div>
    </div>
  `,
  styles: [`
    .anim-glitch-scan {
      animation: glitch-scan 0.3s ease-in-out infinite;
    }

    @keyframes glitch-scan {
      0% { transform: translateY(-100vh); opacity: 0; }
      20% { opacity: 0.8; }
      50% { transform: translateY(50vh); opacity: 0.4; }
      80% { opacity: 0.8; }
      100% { transform: translateY(100vh); opacity: 0; }
    }
  `]
})
export class GlitchOverlayComponent {
  @Input() active = false;
}
