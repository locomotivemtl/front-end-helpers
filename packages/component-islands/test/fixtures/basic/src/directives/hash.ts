export default function hash(load, { value }, _$el, ctx) {
    if (location.hash === value) {
        void load();
        return;
    }
    const onChange = () => location.hash === value && void load();
    window.addEventListener('hashchange', onChange);
    ctx.onCleanup(() => window.removeEventListener('hashchange', onChange));
}
