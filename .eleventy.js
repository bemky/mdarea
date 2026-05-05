const syntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight');

module.exports = function (eleventyConfig) {
    eleventyConfig.addPlugin(syntaxHighlight);
    eleventyConfig.addPassthroughCopy({ 'docs/main.css': 'main.css' });
    eleventyConfig.addWatchTarget('docs/main.js');
    eleventyConfig.addWatchTarget('lib/');

    return {
        dir: {
            input: 'docs',
            output: '_docs',
            includes: '_includes'
        },
        templateFormats: ['njk', 'md', 'html'],
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk'
    };
};
