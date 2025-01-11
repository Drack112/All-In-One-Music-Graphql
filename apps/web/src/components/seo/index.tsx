import { NextSeo } from 'next-seo'

interface SeoProps {
  title?: string
  description?: string
  image?: string
  path?: string
}

export const Seo = (props: SeoProps) => {
  const { description, image, path = '', title } = props

  return (
    <NextSeo
      title={title || 'All In One Music - Enjoy unlimited free music!'}
      titleTemplate={title ? '%s | All In One Music' : 'All In One Music'}
      canonical={`${process.env.NEXT_PUBLIC_SITE_URL}${path}`}
      description={description}
      openGraph={{
        url: `${process.env.NEXT_PUBLIC_SITE_URL}${path}`,
        title: title || 'All In One Music - Enjoy unlimited free music!',
        description,
        ...(image
          ? {
              images: [
                {
                  url: image,
                  alt: 'Og Image',
                  type: 'image/jpeg',
                },
              ],
            }
          : {}),
        siteName: 'All In One Music',
      }}
    />
  )
}
