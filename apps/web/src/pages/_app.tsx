import '../styles/globals.css'
import 'simplebar-react/dist/simplebar.min.css'

import type { AppProps } from 'next/app'
import Head from 'next/head'
import { PagesProgressBar as ProgressBar } from 'next-nprogress-bar'

import MainLayout from '@/layout/main'
import { AppProvider } from '@/providers/app-provider'

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
      </AppProvider>
    </>
  )
}

export default MyApp
