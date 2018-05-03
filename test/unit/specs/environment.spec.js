import { getAPIBaseUrl, API } from '@/services/environment'

describe('environment', () => {
  function getAPIBase (url) {
    /* global jsdom */
    jsdom.reconfigure({
      url: `http://${url}`
    })
    return getAPIBaseUrl()
  }

  it('should return the acceptance API when running in the acceptance environment', () => {
    expect(getAPIBase('acc.xxx')).toEqual(API.ACC)
    expect(getAPIBase('acc.')).toEqual(API.ACC)
    expect(getAPIBase('acc')).not.toEqual(API.ACC)
  })

  it('should return the acceptance API when running locally', () => {
    expect(getAPIBase('localhost')).toEqual(API.ACC)
    expect(getAPIBase('localhost:123')).toEqual(API.ACC)
    expect(getAPIBase('localho')).not.toEqual(API.ACC)
  })

  it('should return the production API when not running locally or in the acceptance environment', () => {
    expect(getAPIBase('x')).toEqual(API.PRD)
    expect(getAPIBase('xyz')).toEqual(API.PRD)
  })
})
