// In-memory store for File objects that can't be passed through router state
const store: Record<string, File> = {};

export const setFile = (key: string, file: File) => {
  store[key] = file;
};
export const getFile = (key: string): File | null => store[key] ?? null;
export const clearFiles = () => {
  Object.keys(store).forEach((k) => delete store[k]);
};
