
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { MediaHeader, MediaInfo, MediaListItem, MediaListSelect } from 'podverse-ui'
import { getEpisodeUrl, getPodcastUrl, mediaListSelectItemsPlayer, 
  mediaListSubSelectItemsPlayer, mediaListSubSelectItemsSort } from '~/lib/constants'
import { scrollToTopOfView } from '~/lib/scrollToTop'
import { readableDate } from '~/lib/util';
import { bindActionCreators } from 'redux';
import { currentPageLoadNowPlayingItem } from '~/redux/actions';

type Props = {
  currentPage?: any,
  currentPageLoadNowPlayingItem?: any,
  listItems: any[]
  mediaPlayer?: any
}

// Load data from state to render text immediately and prevent flash-of-content
// while the backend data loads
type State = {
  episode?: any
  listItems: any[]
  podcast?: any
}

class MediaContentView extends Component<Props, State> {

  static defaultProps: Props = {
    listItems: []
  }

  constructor (props) {
    super(props)

    this.state = {
      episode: props.episode,
      listItems: props.listItems,
      podcast: props.podcast
    }
  }

  handleAnchorOnClick (event, data, itemType) {
    const { currentPageLoadNowPlayingItem } = this.props

    if (itemType === 'episode') {
      // newState.episode = data
    } else if (itemType === 'mediaRef') {
      // newState.mediaRef = data
    } else if (itemType === 'nowPlayingItem') {
      currentPageLoadNowPlayingItem(data)
    } else if (itemType === 'podcast') {
      // newState.podcast = data
    }

    scrollToTopOfView()
  }

  render () {
    const { currentPage } = this.props
    const { mediaRef, nowPlayingItem } = currentPage
    const { episode, listItems, podcast } = this.state

    let headerBottomText, headerImageUrl, headerSubTitle, headerSubTitleLink,
      headerTitle, headerTitleLink, infoClipEndTime, infoClipStartTime,
      infoClipTitle, infoDescription, infoIsFullEpisode

    if (episode) {
      console.log(episode)
    } else if (mediaRef) {
      const { endTime, episodeDescription, episodeId, episodePubDate, episodeTitle,
        podcastId, podcastImageUrl, podcastTitle, startTime, title } = mediaRef

      headerBottomText = readableDate(episodePubDate)
      headerImageUrl = podcastImageUrl
      headerSubTitle = episodeTitle
      headerSubTitleLink = getEpisodeUrl(episodeId)
      headerTitle = podcastTitle
      headerTitleLink = getPodcastUrl(podcastId)
      infoClipEndTime = endTime
      infoClipStartTime = startTime
      infoClipTitle = title
      infoDescription = episodeDescription
      infoIsFullEpisode = !startTime && !endTime
    } else if (nowPlayingItem) {
      const { clipEndTime, clipStartTime, clipTitle, episodeDescription,
        episodeId, episodePubDate, episodeTitle, imageUrl, podcastId,
        podcastTitle } = nowPlayingItem

      headerBottomText = readableDate(episodePubDate)
      headerImageUrl = imageUrl
      headerSubTitle = episodeTitle
      headerSubTitleLink = getEpisodeUrl(episodeId)
      headerTitle = podcastTitle
      headerTitleLink = getPodcastUrl(podcastId)
      infoClipEndTime = clipEndTime
      infoClipStartTime = clipStartTime
      infoClipTitle = clipTitle
      infoDescription = episodeDescription
      infoIsFullEpisode = !clipStartTime && !clipEndTime
    } else if (podcast) {
      console.log(podcast)
    }

    const listItemNodes = listItems.map((x, index) =>
      <MediaListItem
        dataNowPlayingItem={x}
        handleAnchorOnClick={(e) => { this.handleAnchorOnClick(e, x, 'nowPlayingItem') }}
        hasLink={true}
        itemType='now-playing-item'
        key={`nowPlayingListItem${index}`}
        showMoreMenu={true} />
    )

    return (
      <Fragment>
        <MediaHeader
          bottomText={headerBottomText}
          imageUrl={headerImageUrl}
          subTitle={headerSubTitle}
          subTitleLink={headerSubTitleLink}
          title={headerTitle}
          titleLink={headerTitleLink} />
        <MediaInfo
          clipEndTime={infoClipEndTime}
          clipStartTime={infoClipStartTime}
          clipTitle={infoClipTitle}
          description={infoDescription}
          isFullEpisode={infoIsFullEpisode} />
        <div className='media-list'>
          <MediaListSelect
            items={mediaListSelectItemsPlayer}
            selected={mediaListSelectItemsPlayer[0].value} />
          <MediaListSelect
            items={mediaListSubSelectItemsPlayer}
            selected={mediaListSubSelectItemsPlayer[0].value} />
          <MediaListSelect
            items={mediaListSubSelectItemsSort}
            selected={mediaListSubSelectItemsSort[0].value} />
          {listItemNodes}
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  currentPageLoadNowPlayingItem: bindActionCreators(currentPageLoadNowPlayingItem, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(MediaContentView)
