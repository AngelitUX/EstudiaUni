import { DOCUMENT } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs/operators';

const SITE_URL = 'https://estudiauni.cl';
const DEFAULT_TITLE = 'EstudiaUni - Prepara tu PAES';
const DEFAULT_DESCRIPTION = 'Plataforma para preparar la PAES con IA, práctica adaptativa y simulacros completos';

@Injectable({ providedIn: 'root' })
export class SeoService {
  private title = inject(Title);
  private meta = inject(Meta);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);
  private document = inject(DOCUMENT);

  init() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(() => {
        let route = this.activatedRoute;
        while (route.firstChild) route = route.firstChild;
        return route.snapshot;
      })
    ).subscribe(snapshot => {
      const pageTitle = snapshot.data['title'] as string | undefined;
      const pageDescription = snapshot.data['description'] as string | undefined;

      this.title.setTitle(pageTitle ? `${pageTitle} · EstudiaUni.cl` : DEFAULT_TITLE);
      this.meta.updateTag({ name: 'description', content: pageDescription || DEFAULT_DESCRIPTION });
      this.meta.updateTag({ property: 'og:title', content: pageTitle ? `${pageTitle} · EstudiaUni.cl` : DEFAULT_TITLE });
      this.meta.updateTag({ property: 'og:description', content: pageDescription || DEFAULT_DESCRIPTION });
      this.meta.updateTag({ name: 'robots', content: snapshot.data['noIndex'] ? 'noindex, nofollow' : 'index, follow' });
      this.updateCanonical(SITE_URL + this.router.url.split('?')[0].split('#')[0]);
    });
  }

  private updateCanonical(url: string) {
    let link = this.document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!link) {
      link = this.document.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }
}
