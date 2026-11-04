import { TestBed } from '@angular/core/testing';
import { ArchitectureDiagram } from './architecture-diagram';
import { Diagram } from '../../data/info';

const DIAGRAM: Diagram = {
  title: 'Test',
  caption: 'A small test diagram.',
  nodes: [
    { id: 'a', label: 'Client', kind: 'client', col: 0, row: 0 },
    { id: 'b', label: 'Service', kind: 'service', col: 1, row: 0, highlight: true },
    { id: 'c', label: 'Store', kind: 'store', col: 1, row: 1 },
  ],
  edges: [
    { from: 'a', to: 'b', label: 'call' },
    { from: 'b', to: 'a', label: 'reply' },
    { from: 'b', to: 'c' },
    { from: 'b', to: 'missing' },
  ],
};

describe('ArchitectureDiagram', () => {
  function render(): HTMLElement {
    const fixture = TestBed.createComponent(ArchitectureDiagram);
    fixture.componentRef.setInput('diagram', DIAGRAM);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('renders one group per node and marks the highlight', () => {
    const el = render();
    expect(el.querySelectorAll('.diagram__node').length).toBe(3);
    expect(el.querySelectorAll('.diagram__node.is-highlight').length).toBe(1);
  });

  it('skips edges whose endpoints are unknown', () => {
    const el = render();
    expect(el.querySelectorAll('.diagram__edge').length).toBe(3);
    expect(el.querySelectorAll('.diagram__edge-label').length).toBe(2);
  });

  it('draws opposite edges side by side rather than on top of each other', () => {
    const el = render();
    const [there, back] = Array.from(el.querySelectorAll('.diagram__edge'));
    expect(there.getAttribute('y1')).not.toBe(back.getAttribute('y2'));
  });

  it('describes the diagram for screen readers', () => {
    const el = render();
    const label = el.querySelector('svg')?.getAttribute('aria-label') ?? '';
    expect(label).toContain('Client');
    expect(label).toContain('A small test diagram.');
  });
});
