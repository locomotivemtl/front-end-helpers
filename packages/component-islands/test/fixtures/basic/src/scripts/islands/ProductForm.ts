class ProductForm extends HTMLElement {
    connectedCallback() {
        this.dataset.ready = 'product-form-marker';
    }
}

customElements.define('product-form', ProductForm);
