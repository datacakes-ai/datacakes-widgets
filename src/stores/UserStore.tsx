// import cookies from 'js-cookie'
import { makeAutoObservable } from 'mobx'
import {
  CLOUD_ENVS,
  COOKIE_KEY_USER_EMAIL,
  CURRENT_ENV,
  LOGIN_URL,
  LOGOUT_URL
} from '../core/config/main'
import { info } from '../core/services/alerts'
import { isEndUserView } from '../core/utils/main'

export class UserStore {
  /**
   * An authenticated user should have a userEmail in cookies.
   */
  public userEmail?: string
  
  constructor() {
    makeAutoObservable(this)
    this.init()
  }

  public isAuthenticated(): boolean {
    return Boolean(this.userEmail)
  }

  public isInsider(): boolean {
    return Boolean(this.userEmail && this.userEmail.includes('@datacakes.ai'))
  }
  public isRob(): boolean {
    return Boolean(this.userEmail && this.userEmail == 'rob@datacakes.ai')
  }
    
  private setUserEmail(userEmail: string) {
    this.userEmail = userEmail
  }

  private init() {
    const userEmail = this.fetchUserEmail()

    if (!isEndUserView() && userEmail != null) {
      // The user is authenticated.
      this.setUserEmail(userEmail)
      
      // // User must have a login_env cookie, if not, log them out
      // const cookieEnv = this.getLoginEnv() || ''
      // if (!cookieEnv || cookieEnv=='') {
      //   window.location.href=LOGOUT_URL
      //   return
      // } 
      
      // // If either of current environment or login environment was a cloud environment, then they must match
      // if (CLOUD_ENVS.includes(cookieEnv) || CLOUD_ENVS.includes(CURRENT_ENV)) {
      //   if (cookieEnv != CURRENT_ENV)
      //     window.location.href=LOGIN_URL
      // }
      // // Otherwise, just alert what the login and current environment are...
      // else
      //   info(`Login environment was ${cookieEnv}\nCurrent environment is ${CURRENT_ENV}`)
    }
  }


  private getLoginEnv() {
    return false; // cookies.get('login_env')
  }
    
  private fetchUserEmail(): string | undefined {
    return ""; // cookies.get(COOKIE_KEY_USER_EMAIL)
  }

}
