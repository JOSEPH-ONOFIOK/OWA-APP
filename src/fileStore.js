// In-memory store for File objects that can't be passed through router state
const store = {}
export const setFile  = (key, file) => { store[key] = file }
export const getFile  = (key)       => store[key] ?? null
export const clearFiles = ()        => { Object.keys(store).forEach(k => delete store[k]) }
