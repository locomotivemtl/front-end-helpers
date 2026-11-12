class CartDrawer extends HTMLElement {
    connectedCallback() {
        this.dataset.ready = 'cart-drawer-marker';
    }
}

customElements.define("cart-drawer", CartDrawer);
