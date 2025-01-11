import '../styles/globals.css'
import 'simplebar-react/dist/simplebar.min.css'

import type { AppProps } from 'next/app'
import Head from 'next/head'
import { PagesProgressBar as ProgressBar, useRouter } from 'next-nprogress-bar'

import MainLayout from '@/layout/main'
import { AppProvider } from '@/providers/app-provider'
import { useCallback, useEffect, useState } from 'react'
import { searchArtistQuery } from '@/api'
import { useGlobalSearchStore } from '@/store/use-global-search'
import { debounce } from 'lodash'
import { CommandPalette } from '@/components/command/pallete'

const ArtistSearchCommandPalette = () => {
  const { isOpen, setIsOpen, search, setSearch, setResults, results } =
    useGlobalSearchStore()

  const router = useRouter()

  const [isSearching, setIsSearching] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const delayedSearch = useCallback(
    debounce(async (value: string) => {
      if (value.length < 3) {
        setResults([])
        return
      }

      setIsSearching(true)

      const searchArtistQueryResponse = await searchArtistQuery({
        artist: value,
      })

      setResults(searchArtistQueryResponse.searchArtists)
      setIsSearching(false)
    }, 300),
    []
  )

  useEffect(() => {
    if (search) {
      delayedSearch(search)?.catch((e) => {
        console.error('Error searching artist', e)
      })
    }
  }, [delayedSearch, search])

  const onSelect = async (value: string) => {
    if (!value) return
    setIsOpen(false)
    await router.push(`/artist/${value}`)
  }

  return (
    <CommandPalette
      onSelect={(value) => {
        void onSelect(value)
      }}
      commands={results}
      value={search}
      isLoading={isSearching}
      onInputChange={(value) => {
        setSearch(value)
      }}
      isOpen={isOpen}
      onClose={() => {
        setSearch('')
        setResults([])
        setIsOpen(false)
      }}
    />
  )
}

const MyApp = (props: AppProps) => {
  const { Component, pageProps } = props

  return (
    <>
      <AppProvider pageProps={pageProps}>
        <Head>
          <meta
            name='viewport'
            content='minimum-scale=1, initial-scale=1, width=device-width'
          />
        </Head>
        <ProgressBar color='#FC3967' options={{ showSpinner: false }} />

        <MainLayout>
          <Component {...pageProps} />
        </MainLayout>
        <ArtistSearchCommandPalette />
      </AppProvider>
    </>
  )
}

export default MyApp
