import {create} from 'zustand'

export const useDDRStore = create((set) => ({
    data: null,
    fileName: null,
    isLoading: false,
    error: null,

    setData: (data, fileName) => set({data, fileName, isLoading: false, error: null}),
    setLoading: (isLoading) => set({isLoading}),
    setError: (error) => set({error, isLoading: false}),
    reset: () => set({data: null, fileName: null, isLoading: false, error: null})
}))