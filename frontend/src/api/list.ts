export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export const getListResults = <T>(
  data: T[] | PaginatedResponse<T>,
): T[] => {
  if (Array.isArray(data)) {
    return data;
  }

  return data.results;
};