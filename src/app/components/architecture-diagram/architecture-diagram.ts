import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Diagram, DiagramNode } from '../../data/info';

const COL_WIDTH = 232;
const ROW_HEIGHT = 118;
const BOX_WIDTH = 160;
const BOX_HEIGHT = 62;
const PAD = 16;
const ARROW_GAP = 4;
const PAIR_OFFSET = 6;

let nextId = 0;

interface LaidOutNode extends DiagramNode {
  x: number;
  y: number;
}

interface LaidOutEdge {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  dashed: boolean;
  label?: string;
  lx: number;
  ly: number;
  lw: number;
}

@Component({
  selector: 'app-architecture-diagram',
  templateUrl: './architecture-diagram.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchitectureDiagram {
  readonly diagram = input.required<Diagram>();

  protected readonly markerId = `dg-arrow-${nextId++}`;
  protected readonly box = { w: BOX_WIDTH, h: BOX_HEIGHT };

  protected readonly nodes = computed<LaidOutNode[]>(() =>
    this.diagram().nodes.map(n => ({ ...n, x: PAD + n.col * COL_WIDTH, y: PAD + n.row * ROW_HEIGHT })),
  );

  protected readonly size = computed(() => {
    const nodes = this.nodes();
    const w = Math.max(...nodes.map(n => n.x)) + BOX_WIDTH + PAD;
    const h = Math.max(...nodes.map(n => n.y)) + BOX_HEIGHT + PAD;
    return { w, h };
  });

  protected readonly edges = computed<LaidOutEdge[]>(() => {
    const byId = new Map(this.nodes().map(n => [n.id, n]));
    const all = this.diagram().edges;
    const out: LaidOutEdge[] = [];

    for (const e of all) {
      const a = byId.get(e.from);
      const b = byId.get(e.to);
      if (!a || !b) continue;

      const ax = a.x + BOX_WIDTH / 2, ay = a.y + BOX_HEIGHT / 2;
      const bx = b.x + BOX_WIDTH / 2, by = b.y + BOX_HEIGHT / 2;
      const dx = bx - ax, dy = by - ay;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;

      // Distance from a box centre to its border along the edge direction
      const toBorder = Math.min(
        ux === 0 ? Infinity : BOX_WIDTH / 2 / Math.abs(ux),
        uy === 0 ? Infinity : BOX_HEIGHT / 2 / Math.abs(uy),
      );

      // Opposite edges between the same pair are drawn side by side
      const paired = all.some(o => o.from === e.to && o.to === e.from);
      const nx = -uy * (paired ? PAIR_OFFSET : 0);
      const ny = ux * (paired ? PAIR_OFFSET : 0);

      const x1 = ax + ux * (toBorder + ARROW_GAP) + nx;
      const y1 = ay + uy * (toBorder + ARROW_GAP) + ny;
      const x2 = bx - ux * (toBorder + ARROW_GAP) + nx;
      const y2 = by - uy * (toBorder + ARROW_GAP) + ny;

      out.push({
        x1, y1, x2, y2,
        dashed: !!e.dashed,
        label: e.label,
        lx: (x1 + x2) / 2 + nx * 2.2,
        ly: (y1 + y2) / 2 + ny * 2.2,
        lw: e.label ? e.label.length * 5.6 + 12 : 0,
      });
    }
    return out;
  });

  protected readonly ariaLabel = computed(() => {
    const d = this.diagram();
    const parts = d.nodes.map(n => n.label).join(', ');
    return `${d.title}: ${parts}. ${d.caption}`;
  });

  protected kindLabel(node: DiagramNode): string {
    return node.kind === 'terminal' ? 'final' : node.kind;
  }

  protected isState(node: DiagramNode): boolean {
    return node.kind === 'state' || node.kind === 'terminal';
  }
}
