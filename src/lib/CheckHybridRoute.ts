const HybridRoutePath: {
  [key: string]: {
    pattern: RegExp;
    paramsNames: string[];
  };
} = {
  ArticleWrite: {
    pattern: /\/board\/(\d+)\/write/,
    paramsNames: ["boardId"],
  },
  ArticleReport: {
    pattern: /\/board\/(\d+)\/(\d+)\/report/,
    paramsNames: ["boardId", "articleId"],
  },
  UserReport: {
    pattern: /\/user\/([^\/]+)\/report/,
    paramsNames: ["userId"],
  },
};

export const checkHybridRoutePath = (
  path: string
): {
  path: string;
  params: {
    [key: string]: string;
  };
} | null => {
  const keys = Object.keys(HybridRoutePath);
  const key = keys.find((key) => HybridRoutePath[key].pattern.test(path));
  console.log(key, keys);
  if (key) {
    return {
      path: key,
      params: HybridRoutePath[key].paramsNames.reduce(
        (acc, cur, idx) => ({
          ...acc,
          [cur]: path.match(HybridRoutePath[key].pattern)![idx + 1],
        }),
        {}
      ),
    };
  }
  return null;
};
