import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import OmniAural from "omniaural"
import type { Podcast } from 'podverse-shared'
import { useEffect, useState } from 'react'
import { List, PageHeader, PageHeaderWithTabs, PageScrollableContent, Pagination,
  PodcastListItem, SearchPageInput } from '~/components'
import { Page } from '~/lib/utility/page'
import { PV } from '~/resources'
import { getServerSideAuthenticatedUserInfo } from '~/services/auth'
import { getPodcastsByQuery } from '~/services/podcast'
import { scrollToTopOfPageScrollableContent } from '~/components/PageScrollableContent/PageScrollableContent'

interface ServerProps extends Page {}

const keyPrefix = 'pages_search'

export default function Search(props: ServerProps) {
  const router = useRouter()
  const { t } = useTranslation()

  const pageTitle = t('Search')
  const pageHeaderTabs = generateTabOptions(t)

  return (
    <>
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageHeaderWithTabs
        keyPrefix={keyPrefix}
        onClick={() => console.log('wtf')}
        selectedKey={PV.Filters.search.queryParams.podcast}
        tabOptions={pageHeaderTabs}
        title={pageTitle} />
      <SearchPageInput />
      {/* <PageScrollableContent>
        <List>
          {generatePodcastListElements(podcastsListData)}
        </List>
        <Pagination
          currentPageIndex={filterPage}
          handlePageNavigate={(newPage) => {
            setFilterState({ filterFrom, filterPage: newPage, filterSort })
          }}
          handlePageNext={() => {
            const newPage = filterPage + 1
            if (newPage <= pageCount) {
              setFilterState({ filterFrom, filterPage: newPage, filterSort })
            }
          }}
          handlePagePrevious={() => {
            const newPage = filterPage - 1
            if (newPage > 0) {
              setFilterState({ filterFrom, filterPage: newPage, filterSort })
            }
          }}
          pageCount={pageCount} />
      </PageScrollableContent> */}
    </>
  )
}

/* Client-Side Queries */

type ClientQueryPodcasts = {
  from?: string
  page?: number
  sort?: string
}

// const clientQueryPodcasts = async (
//   { from, page, sort }: ClientQueryPodcasts,
//   filterState: FilterState
// ) => {
//   const finalQuery = {
//     ...(from ? { from } : { from: filterState.filterFrom }),
//     ...(page ? { page } : { page: filterState.filterPage }),
//     ...(sort ? { sort } : { sort: filterState.filterSort })
//   }
//   return getPodcastsByQuery(finalQuery)
// }

/* Render Helpers */

const generateTabOptions = (t: any) => [
  { label: t('Podcasts'), key: PV.Filters.search.queryParams.podcast },
  { label: t('Hosts'), key: PV.Filters.search.queryParams.host },
]

// const generatePodcastListElements = (listItems: Podcast[]) => {
//   return listItems.map((listItem, index) =>
//     <PodcastListItem
//       key={`${keyPrefix}-${index}`}
//       podcast={listItem} />
//   )
// }

/* Server-Side Logic */

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { req, locale } = ctx
  const { cookies } = req

  const userInfo = await getServerSideAuthenticatedUserInfo(cookies)

  const serverProps: ServerProps = {
    serverUserInfo: userInfo,
    ...(await serverSideTranslations(locale, PV.i18n.fileNames.all)),
    serverCookies: cookies
  }

  return { props: serverProps }
}
