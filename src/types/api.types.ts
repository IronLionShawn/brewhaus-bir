export interface APIFilterColumns {
    [column: string]: string;
}

export interface APIFilters {
    columns?: APIFilterColumns;
    per_page: number;
    page: number;
}