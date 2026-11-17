const DEFAULT_DIRECTORIES = ['/src/scripts/islands/'];
export function resolveOptions(options = {}) {
    const { directories = DEFAULT_DIRECTORIES, directives = {}, retry, debug = false } = options;
    const { visible, idle, media, defer, interaction, custom = [] } = directives;
    return {
        directories: [directories].flat(),
        custom,
        runtime: {
            directives: {
                visible: {
                    attribute: 'island:visible',
                    rootMargin: '200px',
                    threshold: 0,
                    ...visible
                },
                idle: { attribute: 'island:idle', timeout: 500, ...idle },
                media: { attribute: 'island:media', ...media },
                defer: { attribute: 'island:defer', delay: 3000, ...defer },
                interaction: {
                    attribute: 'island:interaction',
                    events: ['mouseenter', 'touchstart', 'focusin'],
                    ...interaction
                }
            },
            retry: { retries: 0, delay: 1000, ...retry },
            debug
        }
    };
}
