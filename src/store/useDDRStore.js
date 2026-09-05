import {create} from 'zustand'

export const useDDRStore = create((set) => ({
    data: null,
    fileName: null,
    isLoading: false,
    progress: 0,
    progressStage: '',
    error: null,

    setData: (data, fileName) => set({data, fileName, isLoading: false, progress: 0, progressStage: '', error: null}),
    setLoading: (isLoading) => set({isLoading, progress: 0, progressStage: '', error: null}),
    setProgress: (progress, stage) => set({progress, progressStage: stage}),
    setError: (error) => set({error, isLoading: false, progress: 0}),
    reset: () => set({data: null, fileName: null, isLoading: false, progress: 0, progressStage: '', error: null})
}))