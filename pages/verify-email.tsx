import Link from 'next/link'
import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import Meta from '~/components/Meta/Meta'
import { getUrlFromRequestOrWindow, alertRateLimitError } from '~/lib/utility'
import { modalsLoginShow, modalsSendVerificationEmailShow, pageIsLoading } from '~/redux/actions'
import { verifyEmail } from '~/services/auth'

type Props = {
  hasError?: string
  meta?: any
  modalsLoginShow?: any
  modalsSendVerificationEmailShow?: any
}

type State = {}

class VerifyEmail extends Component<Props, State> {

  static async getInitialProps({ query, req, store }) {
    const token = query.token

    const meta = {
      currentUrl: getUrlFromRequestOrWindow(req),
      description: `Verify your email address on Podverse`,
      title: `Verify your email address`
    }

    store.dispatch(pageIsLoading(false))
    
    try {
      await verifyEmail(token)

      return { meta }
    } catch (error) {
      if (error && error.response && error.response.status === 429) {
        alertRateLimitError(error)
        return
      }

      return { hasError: true, meta }
    }
  }

  constructor(props) {
    super(props)

    this.state = {}
  }

  _showSendVerificationEmailModal = async () => {
    const { modalsSendVerificationEmailShow } = this.props
    modalsSendVerificationEmailShow(true)
  }

  _handleLoginPress = () => {
    const { modalsLoginShow } = this.props
    modalsLoginShow(true)
  }

  render() {
    const { hasError, meta } = this.props

    return (
      <Fragment>
        <Meta
          description={meta.description}
          ogDescription={meta.description}
          ogTitle={meta.title}
          ogType='website'
          ogUrl={meta.currentUrl}
          robotsNoIndex={true}
          title={meta.title}
          twitterDescription={meta.description}
          twitterTitle={meta.title} />
        {
          !hasError &&
            <Fragment>
              <h3>Email Verified</h3>
              <p>Thank you for verifying! You should now be able to login.</p>
              <p className='font-bolder'>
                <Link as='/' href='/'>
                  <a onClick={this._handleLoginPress}>Login</a>
                </Link>
              </p>
            </Fragment>
        }
        {
          hasError &&
            <Fragment>
              <h3>Email Verification Failed</h3>
              <p>This token may have expired.</p>
              <p>
                <a href='#' onClick={this._showSendVerificationEmailModal}>
                  send verification email
                </a>
              </p>
            </Fragment>
        }
      </Fragment>
    )
  }
}

const mapStateToProps = state => ({ ...state })

const mapDispatchToProps = dispatch => ({
  modalsLoginShow: bindActionCreators(modalsLoginShow, dispatch),
  modalsSendVerificationEmailShow: bindActionCreators(modalsSendVerificationEmailShow, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(VerifyEmail)
