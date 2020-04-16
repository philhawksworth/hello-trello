
module.exports = function(eleventyConfig) {

  // A handy markdown shortcode for blocks of markdown
  // coming from our data sources
  const markdownIt = require('markdown-it');
  const md = new markdownIt({
    html: true
  });
  eleventyConfig.addPairedShortcode('markdown', (content) => {
    return md.render(content);
  });

  // Where are my things?
  return  {
    dir: {
      input: "src",
      output: "dist"
    }
  };

};
