import type { Plugin } from 'vite';
import { type ComponentIslandsOptions } from './options.js';
export type { ClientDirective, ClientDirectiveContext, ClientDirectiveOptions, ComponentIslandsOptions } from './options.js';
export type { IslandErrorDetail, IslandLoadDetail } from './events.js';
/** Vite plugin that finds islands and emits the `@locomotivemtl/component-islands/revive` module. */
export default function componentIslands(userOptions?: ComponentIslandsOptions): Plugin;
