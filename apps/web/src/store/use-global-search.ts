import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface GlobalSearchState {
  search: string
  results: string[]
  isOpen: boolean
  setSearch: (search: string) => void
  setIsOpen: (isOpen: boolean) => void
  setResults: (results: string[]) => void
}

export const useGlobalSearchStore = create<GlobalSearchState>()(
  devtools(
    immer((set) => ({
      search: '',
      results: [],
      isOpen: false,
      setSearch: (search) =>
        set((state) => {
          state.search = search
        }),
      setIsOpen: (isOpen) =>
        set((state) => {
          state.isOpen = isOpen
        }),
      setResults: (results) =>
        set((state) => {
          state.results = results
        }),
    }))
  )
)
