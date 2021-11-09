import OmniAural, { useOmniAural } from "omniaural"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import Modal from 'react-modal'
import { ButtonClose, ButtonLink, ButtonRectangle, TextInput } from "~/components"
import { login as loginService } from "~/services/auth"

type Props = {}

export const LoginModal = (props: Props) => {
  const [login] = useOmniAural("modals.login")
  const { t } = useTranslation()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  /* Event Handlers */

  const _handleLogin = async () => {
    try {
      console.log('hello', email, password)
      await loginService(email, password)
      window.location.reload()
    } catch (error) {
      const pleaseVerifyMessage = (
        <>
          <p>{t('PleaseVerifyEmail')}</p>
          {/* <span><a href='#' onClick={this._showSendVerificationEmailModal}>{t('SendVerificationEmail')}</a></span> */}
        </>
      )
      const errorMsg =
        (error.response && error.response.status === 460 && pleaseVerifyMessage) ||
        (error.response && error.response.data && error.response.data.message)
        || t('errorMessages:internetConnectivityErrorMessage')

      console.log('errorMsg', error)
      // modalsLoginSetErrorResponse(errorMsg)
      // modalsLoginIsLoading(false)
      // userSetInfo({
      //   email: null,
      //   emailVerified: null,
      //   freeTrialExpiration: null,
      //   historyItems: [],
      //   id: null,
      //   isPublic: null,
      //   mediaRefs: [],
      //   membershipExpiration: null,
      //   name: null,
      //   playlists: [],
      //   queueItems: [],
      //   subscribedPlaylistIds: [],
      //   subscribedPodcastIds: [],
      //   subscribedUserIds: []
      // })
    }
  }

  const _onAfterOpen = () => {
    // console.log('onAfterOpen')
  }

  const _onRequestClose = () => {
    OmniAural.modalsLoginHide()
  }

  return (
    <Modal
      className='login-modal centered'
      contentLabel={t('Login modal')}
      isOpen={login.show}
      onAfterOpen={_onAfterOpen}
      onRequestClose={_onRequestClose}>
      <h2>{t('Login')}</h2>
      <ButtonClose onClick={_onRequestClose} />
      <TextInput
        label={t('Email')}
        onChange={setEmail}
        placeholder={t('Email')}
        type='email'
        value={login.email} />
      <TextInput
        label={t('Password')}
        onChange={setPassword}
        placeholder={t('Password')}
        type='password'
        value={login.password} />
      <div className='submit-buttons'>
        <ButtonRectangle
          label={t('Cancel')}
          type='secondary' />
        <ButtonRectangle
          label={t('Submit')}
          onClick={_handleLogin}
          type='primary' />
      </div>
      <div className='signup-buttons'>
        <ButtonLink
          label={t('Reset Password')} />
        <ButtonLink
          label={t('Sign Up')} />
      </div>
    </Modal>
  )
}
