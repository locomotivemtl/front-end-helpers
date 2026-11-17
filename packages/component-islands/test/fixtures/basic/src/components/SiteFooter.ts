import Island from '@locomotivemtl/component-islands/island';

class SiteFooter extends Island(HTMLElement) {
    connectedCallback() {
        this.dataset.ready = 'site-footer-marker';
    }
}

customElements.define('site-footer', SiteFooter);
