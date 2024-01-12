

export type Commentable = keyof typeof commentableCategories;

export const publishedCategories = {
  'articles': true,
  'blogs': true,
  'pages': true,
  'til': true,
}

export const commentableCategories = {
  'blogs': true,
  'articles': true,
  'til': true
} as const;

export const isCommentable = (s: string) : s is Commentable =>
  s in commentableCategories;

export const showOnMainBlog = (s: string) =>
  s === 'blogs' || s === 'articles';
