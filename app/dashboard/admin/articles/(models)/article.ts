export interface IArticles {
    id?: number;
    title: string | null;
    body: string | null;
    author?: number;
    ordering?: number | null;
    created?: string | null;
}

export interface IArticle {
    id?: number;
    active: boolean | null;
    title: string | null;
    slug?: string | null;
    body: string | null;
    author?: number;
    ordering?: number | null;
    created?: string | null;
}
