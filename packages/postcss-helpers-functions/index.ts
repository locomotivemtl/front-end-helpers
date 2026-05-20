import type { Declaration } from 'postcss';

import dvh from './processors/dvh';
import gridSpace from './processors/grid-space';
import interpolate from './processors/interpolate';
import lvh from './processors/lvh';
import mapClamp from './processors/map-clamp';
import maxScreen from './processors/max-screen';
import minScreen from './processors/min-screen';
import rem from './processors/rem';
import responsiveValue from './processors/responsive-value';
import svh from './processors/svh';
import vw from './processors/vw';

export type PostCSSProcessorHelper = {
    name: string;
    processor: (value: string) => string;
};

const DEFAULT_HELPERS = <PostCSSProcessorHelper[]>[
    { name: 'grid-space', processor: gridSpace },
    { name: 'responsive-value', processor: responsiveValue },
    { name: 'dvh', processor: dvh },
    { name: 'svh', processor: svh },
    { name: 'lvh', processor: lvh },
    { name: 'vw', processor: vw },
    { name: 'rem', processor: rem },
    { name: 'min-screen', processor: minScreen },
    { name: 'max-screen', processor: maxScreen },
    { name: 'map-clamp', processor: mapClamp },
    { name: 'interpolate', processor: interpolate }
];

/**
 * PostCSS plugin that processes custom CSS helper functions
 */
const postcssProcessorHelpers = (helpers: PostCSSProcessorHelper[] = []) => {
    const helpersList = [...DEFAULT_HELPERS, ...helpers];

    // Create regex pattern to match any helper processor: min-screen(, max-screen(, map-range-clamp(
    const helperPattern = new RegExp(
        `(${helpersList.map(h => h.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\s*\\(`,
        'g'
    );

    return {
        helpers: helpersList,
        regex: helperPattern,
        postcssPlugin: 'postcss-helpers',
        Declaration(decl: Declaration) {
            let value = decl.value;

            // Test if any helper function is present using regex
            if (helperPattern.test(value)) {
                // Reset regex lastIndex for processing
                helperPattern.lastIndex = 0;

                // Process each helper in sequence
                // Each helper checks internally if it needs to process the value
                for (const helper of helpersList) {
                    value = helper.processor(value);
                }

                decl.value = value;
            }
        }
    };
};

postcssProcessorHelpers.postcss = true;

export default postcssProcessorHelpers;
