export type RootStackParamList = {
  Root: undefined;
  Webview: { url: string; scrollenabled: boolean };
  ArticleWrite: {
    boardId: string;
  };
  ArticleReport: {
    boardId: string;
    articleId: string;
  };
};
