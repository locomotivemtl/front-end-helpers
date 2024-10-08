const s=()=>({postcssPlugin:"postcss-remove-double-parentheses",AtRule:{media(s){s.params=s.params.replace(/\(\((.*?)\)\)/g,"($1)")}}});s.postcss=!0;export{s as default};
//# sourceMappingURL=postcss-remove-double-parentheses.modern.mjs.map
