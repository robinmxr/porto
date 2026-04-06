import { Component } from '@angular/core';

interface Repo {
  name: string;
  tags: string;
  icon: string;
  baseColor: string;
  hoverColor: string;
}

@Component({
  selector: 'app-active-repos',
  standalone: true,
  imports: [],
  templateUrl: './active-repos.html',
})
export class ActiveRepos {
  repos: Repo[] = [
    {
      name: 'Neural_Path_v2',
      tags: 'PyTorch / CUDA / Optimization',
      icon: 'biotech',
      baseColor: 'text-primary-dim',
      hoverColor: 'group-hover:text-primary'
    },
    {
      name: 'Vault_Protocol',
      tags: 'Solidity / Zero-Knowledge',
      icon: 'token',
      baseColor: 'text-secondary-dim',
      hoverColor: 'group-hover:text-secondary'
    }
  ];
}
