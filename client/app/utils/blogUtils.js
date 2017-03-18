import he from 'he';

/**
 * Get a human-readable date format from a given post's 'publishedDate' field
 *
 * @param {string} date   A publishedDate string
 *
 * @return {string|null} Returns either the formatted date, or throws an error
 */
export const getDate = (date) => {
  if (date === 'Invalid Date') {
    return null;
  }

  const d = new Date(date);
  // We only care about the date it was posted, use split to discard the time
  return `${d.toLocaleString().split(',')[0]}`;
};

/**
 * Strip HTML tags from given string for consistently-sized text. Converts any
 * special HTML encoded characters into their plaintext version
 *
 * @param {string} html   A publishedDate string
 *
 * @return {string} Returns raw text of given string, sans HTML tags
 */
export const htmlToString = (html) => {
  const strippedHtml = html.replace(/<[^>]+>/g, '');
  return he.decode(strippedHtml);
};


/**
 * Truncate string down to a maximum of 'limit' characters and add ellipsis if
 * too long.
 *
 * @param {string} string   A string
 * @param {number} limit    Maximum number of characters to return from string
 *
 * @return {string} Returns truncated string if input was longer than limit
 */
export const truncate = (string, limit) => {
  // Do an immediate return for short strings :)
  if (string.length <= limit) { return string; }

  const substring = string.substr(0, limit);
  // Track back to the end of the last whole word and replace with ellipsis so
  // that we don't have partially split word at the end...
  return substring.substr(0, substring.lastIndexOf(' ')).concat('...');
};

/**
 * Generate full metadata for a given blog post's react-helmet, SEO!
 *
 * @param {object} post   A blog post
 * @param {string} post   The full path to this blog post for social sharing
 *
 * @return {object} Returns an object of:
 *  {array} Array of meta-data objects for use by react-helmet
 *  {string} Meta title for the post
 */
export const createMetaData = (post, fullPostUrl) => {
  // Break post info into vars to save typing
  const metaTitle = post.meta.title || post.title;
  const metaDescription = post.meta.description || post.content.brief.html || post.content.brief;
  const metaImageUrl = post.image.url || null;

  // All posts will have this minimum of meta data, tags might be added later
  let metaTags = [
    { name: metaTitle, content: metaDescription },
    // Facebook Open Graph
    { property: 'og:title', content: metaTitle },
    { property: 'og:description', content: metaDescription },
    { property: 'og:type', content: 'article' },
    { property: 'og:image', content: metaImageUrl },
    { property: 'og:url', content: fullPostUrl },
    // Twitter Cards
    { property: 'twitter:title', content: metaTitle },
    { property: 'twitter:description', content: metaDescription },
    { property: 'twitter:card', content: 'summary_large_image' },
    { property: 'twitter:image:src', content: metaImageUrl },
    { property: 'twitter:url', content: fullPostUrl },
  ];

  // If user has specified categories for this post, create a meta object for each
  // and append to the list of meta tags to be generated by Helmet
  if (post.categories) {
    const tags = post.categories.map((category) => ({ property: 'article:tag', content: category.name }));
    metaTags = metaTags.concat(tags);
  }

  return {
    metaTags,
    metaTitle,
  };
};
