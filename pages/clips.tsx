import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { addItemsToSecondaryQueueStorage, clearItemsFromSecondaryQueueStorage } from 'podverse-ui'
import MediaListCtrl from '~/components/MediaListCtrl/MediaListCtrl'
import Meta from '~/components/Meta/Meta'
import config from '~/config'
import { convertToNowPlayingItem } from '~/lib/nowPlayingItem'
import { clone, cookieGetQuery } from '~/lib/utility'
import {
  pageIsLoading, pagesSetQueryState, playerQueueLoadSecondaryItems
} from '~/redux/actions'
import { getCategoriesByQuery, getMediaRefsByQuery } from '~/services'
const { BASE_URL } = config()

type Props = {
  allCategories?: any[]
  categoryId?: string
  lastScrollPosition?: number
  listItems?: any
  meta?: any
  pageKey?: string
  pagesSetQueryState?: any
  playerQueue?: any
  queryFrom?: any
  queryPage: number
  querySort?: any
  queryType?: any
  user?: any
  userSetInfo?: any
}

type State = {}

const kPageKey = 'clips'

class Home extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const allCategoriesAndCountResult = await getCategoriesByQuery({})
    const allCategories = allCategoriesAndCountResult.data[0] || []

    const state = store.getState()
    const { mediaPlayer, pages, user } = state
    const { nowPlayingItem } = mediaPlayer

    const localStorageQuery = cookieGetQuery(req, kPageKey)

    const currentPage = pages[kPageKey] || {}
    const lastScrollPosition = currentPage.lastScrollPosition
    const queryRefresh = !!query.refresh
    const categoryId = query.categoryId || currentPage.categoryId || localStorageQuery.categoryId || (allCategories && allCategories[2] && allCategories[2].id /* Arts */)
    const queryFrom = currentPage.queryFrom || query.from || (query.categoryId && 'from-category') || localStorageQuery.from || (user && user.id ? 'subscribed-only' : 'all-podcasts')
    const queryPage = (queryRefresh && 1) || currentPage.queryPage || query.page || 1
    const querySort = currentPage.querySort || query.sort || localStorageQuery.sort || 'top-past-week'
    const queryType = (queryRefresh && query.type) || currentPage.queryType || query.type ||
      localStorageQuery.type || 'clips'
    let podcastId = ''


    if (queryFrom === 'subscribed-only') {
      podcastId = user.subscribedPodcastIds
    }

    if (Object.keys(currentPage).length === 0 || queryRefresh) {
      const results = await getMediaRefsByQuery({
        from: queryFrom,
        includePodcast: true,
        page: queryPage,
        ...(podcastId ? { podcastId } : {}),
        sort: querySort,
        type: queryType,
        ...(categoryId ? { categories: categoryId } : {}),
      })

      const listItems = results.data[0].map(x => convertToNowPlayingItem(x, null, null)) || []
      const nowPlayingItemIndex = listItems.map((x) => x.clipId).indexOf(nowPlayingItem && nowPlayingItem.clipId)
      const queuedListItems = clone(listItems)
      if (nowPlayingItemIndex > -1) {
        queuedListItems.splice(0, nowPlayingItemIndex + 1)
      }

      store.dispatch(playerQueueLoadSecondaryItems(queuedListItems))

      store.dispatch(pagesSetQueryState({
        pageKey: kPageKey,
        categoryId,
        listItems,
        listItemsTotal: results.data[1],
        queryFrom,
        queryPage,
        querySort,
        queryType,
      }))
    }

    store.dispatch(pageIsLoading(false))

    const meta = {
      currentUrl: BASE_URL,
      description: 'Podcast app for iOS, Android, and web. Create and share podcast highlights and playlists. Sync your queue across all devices. Open source software.',
      title: 'Podverse - Create podcast highlights. Sync your podcasts across iOS, Android, and web. Open source technology.'
    }

    return {
      allCategories, lastScrollPosition, meta, pageKey: kPageKey, queryFrom, queryPage, querySort,
      queryType
    }
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  componentDidMount() {
    const { playerQueue } = this.props
    const { secondaryItems } = playerQueue
    clearItemsFromSecondaryQueueStorage()
    addItemsToSecondaryQueueStorage(secondaryItems)
  }

  render() {
    const { allCategories, categoryId, meta, pagesSetQueryState, queryFrom, queryPage, querySort, queryType
    } = this.props

    return (
      <Fragment>
        <Meta
          description={meta.description}
          ogDescription={meta.description}
          ogTitle={meta.title}
          ogType='website'
          ogUrl={meta.currentUrl}
          robotsNoIndex={false}
          title={meta.title}
          twitterDescription={meta.description}
          twitterTitle={meta.title} />
        <h3>Clips</h3>
        <MediaListCtrl
          adjustTopPosition
          allCategories={allCategories}
          categoryId={categoryId}
          handleSetPageQueryState={pagesSetQueryState}
          pageKey={kPageKey}
          queryFrom={queryFrom}
          queryPage={queryPage}
          querySort={querySort}
          queryType={queryType} />
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  pagesSetQueryState: bindActionCreators(pagesSetQueryState, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)