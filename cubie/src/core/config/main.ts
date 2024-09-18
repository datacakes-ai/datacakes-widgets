
export const DEV = true // import.meta.env.DEV



// Auth-related
export const AUTH_SVC_BASE_URL = DEV
  ? 'http://app-local.datacakes.ai:5004'
  : 'AUTH_SERVICE_URL_REPLACEMENT_STRING'
export const LOGIN_URL = AUTH_SVC_BASE_URL + '/login'
export const LOGOUT_URL = AUTH_SVC_BASE_URL + '/logout'

export const CONNECT_URL = (service: string) => {
  return AUTH_SVC_BASE_URL + `/connect/${service}`
}
export const DISCONNECT_URL = AUTH_SVC_BASE_URL + '/disconnect'

// Backend server URLs
export const DATACAKES_CODE_SERVICE_URL = 'https://api.datacakes.ai';
export const DATACAKES_SOURCE_SERVICE_URL = DEV
  ? 'http://app-local.datacakes.ai:5003'
  : 'SOURCE_SERVICE_URL_REPLACEMENT_STRING'

// Main website links
export const APP_LOGIN_FEEDBACK_URL = 'https://www.datacakes.ai/qb/feedback'
export const INTRO_URL = 'https://www.datacakes.ai/qb/cubie-intro'
export const APP_FAQ_URL = 'https://www.datacakes.ai/qb/faq'

export const MAIN_SITE_URL = 'https://www.datacakes.ai'
export const MAIN_SITE_URL_STAGING = "https://datacakes-ai-2c51d200f36684724ba43eb83e.webflow.io"

export const APP_NAME = 'Cubie'
export const COOKIE_KEY_USER_EMAIL = 'user_email'
export const APP_ROOT_PATH = '/'

// import.meta.env.DEPLOYMENT_ENV
export const CURRENT_ENV = "production" || (
  (AUTH_SVC_BASE_URL.includes('https://auth.')) ? 'production' :
  (AUTH_SVC_BASE_URL.includes('https://auth-demo.')) ? 'demo' :
  (AUTH_SVC_BASE_URL.includes('https://auth-s.')) ? 'staging' :
  (AUTH_SVC_BASE_URL.includes('https://auth-rcs.')) ? 'dev' : 'other'
)

export const CLOUD_ENVS = ['production', 'demo', 'staging', 'dev']