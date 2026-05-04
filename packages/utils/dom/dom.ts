const $html = document.documentElement;
const $body = document.body;

export { $html, $body };

export function forceReflow(node: HTMLElement = $body): void {
    void node.offsetHeight;
}
