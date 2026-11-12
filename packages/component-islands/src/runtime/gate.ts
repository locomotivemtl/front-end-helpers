import type { ClientDirective, RuntimeOptions } from '../options.js';
import {
    waitCustom,
    waitDelay,
    waitIdle,
    waitInteraction,
    waitMedia,
    waitVisible
} from './directives.js';
import { warn } from './log.js';

// Astro renders a bare boolean attribute as "true", so that counts as no value.
function readDirective($el: Element, name: string): string | null {
    const value = $el.getAttribute(name);
    return value === 'true' ? '' : value;
}

/** Reads a strict non-negative integer. An empty value is the default without a warning. */
function readInteger(value: string, fallback: number, attribute: string): number {
    if (value === '') return fallback;
    if (/^\d+$/.test(value)) return Number(value);
    warn(`${attribute}="${value}" is not an integer, using ${fallback}`);
    return fallback;
}

/**
 * Waits for every directive on the element, in order:
 * visible, media, idle, defer, interaction, then custom directives.
 * Without any directive it resolves at once.
 */
export async function waitForGate(
    $el: HTMLElement,
    { directives }: RuntimeOptions,
    customDirectives: Map<string, ClientDirective>,
    signal: AbortSignal
): Promise<void> {
    const { visible, media, idle, defer, interaction } = directives;

    const visibleValue = readDirective($el, visible.attribute);
    if (visibleValue !== null) {
        await waitVisible($el, visibleValue || visible.rootMargin, visible.threshold, signal);
    }

    const mediaValue = readDirective($el, media.attribute);
    if (mediaValue === '') {
        warn(`${media.attribute} needs a media query, skipping it`);
    } else if (mediaValue !== null) {
        await waitMedia(mediaValue, signal);
    }

    const idleValue = readDirective($el, idle.attribute);
    if (idleValue !== null) {
        await waitIdle(readInteger(idleValue, idle.timeout, idle.attribute), signal);
    }

    const deferValue = readDirective($el, defer.attribute);
    if (deferValue !== null) {
        await waitDelay(readInteger(deferValue, defer.delay, defer.attribute), signal);
    }

    const interactionValue = readDirective($el, interaction.attribute);
    if (interactionValue !== null) {
        const events = interactionValue.split(/[\s,]+/).filter(Boolean);
        await waitInteraction($el, events.length ? events : interaction.events, signal);
    }

    for (const [name, directive] of customDirectives) {
        const value = readDirective($el, name);
        if (value !== null) await waitCustom(directive, { name, value }, $el, signal);
    }
}
