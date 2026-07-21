
export interface Pagination<T> {
    current_page: number;
    data: T[];
    total: number;
    per_page: number;
    last_page: number;
}
