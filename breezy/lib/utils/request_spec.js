import {
  isValidResponse,
  argsForFetch
} from './request'
import parse from 'url-parse'
import Headers from 'fetch-headers'

describe('isValidResponse', () => {
  it('returns true if valid', () => {
    const headers = new Headers([
      ['content-type', 'application/json'],
      ['content-disposition', 'inline']
    ])

    const rsp = {
      headers
    }

    expect(isValidResponse(rsp)).toBe(true)
  })

  it('returns false when disposition is attachment', () => {
    const headers = new Headers([
      ['content-type', 'text/javascript'],
      ['content-disposition', 'attachment']
    ])

    const rsp = {
      headers
    }

    expect(isValidResponse(rsp)).toBe(false)
  })

  it('returns false when content-type is not javascript', () => {
    const headers = new Headers([
      ['content-type', 'text/html'],
      ['content-disposition', 'inline']
    ])

    const rsp = {
      headers
    }


    expect(isValidResponse(rsp)).toBe(false)
  })
})

describe('argsForFetch', () => {
  it('returns fetch arguments', () => {
    const getState = () => {
      return {
        breezy: {}
      }
    }

    const args = argsForFetch(getState, '/foo')

    expect(args).toEqual(['/foo?__=0', {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-requested-with': 'XMLHttpRequest',
        'x-breezy-request': true
      },
      credentials: 'same-origin',
      redirect: 'manual'
    }])
  })

  it('returns fetch arguments with content-type json and method POST on non-GETs', () => {
    const getState = () => {
      return {
        breezy: {}
      }
    }

    const args = argsForFetch(getState, '/foo', {method: 'PUT'})

    expect(args).toEqual(['/foo?__=0', {
      method: 'POST',
      headers: {
        accept: 'application/json',
        'x-requested-with': 'XMLHttpRequest',
        'x-breezy-request': true,
        'content-type': 'application/json',
        'x-http-method-override': 'PUT'
      },
      credentials: 'same-origin',
      body: '',
      redirect: 'manual'
    }])
  })

  it('returns fetch arguments x-xhr-referer when currentUrl is set in state', () => {
    const getState = () => {
      return {
        breezy: {
          currentUrl: '/some_current_url'
        }
      }
    }

    const args = argsForFetch(getState, '/foo')

    expect(args).toEqual(['/foo?__=0', {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-requested-with': 'XMLHttpRequest',
        'x-breezy-request': true,
        'x-xhr-referer': '/some_current_url'
      },
      credentials: 'same-origin',
      redirect: 'manual'
    }])
  })

  it('returns fetch args and ignores body on GET or HEAD', () => {
    const getState = () => {
      return {
        breezy: {}
      }
    }

    expect(argsForFetch(getState, '/foo', {body: 'ignored'})).toEqual(['/foo?__=0', {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-requested-with': 'XMLHttpRequest',
        'x-breezy-request': true,
      },
      credentials: 'same-origin',
      redirect: 'manual'
    }])

    expect(argsForFetch(getState, '/foo', {method: 'HEAD', body: 'ignored'})).toEqual(['/foo?__=0', {
      method: 'HEAD',
      headers: {
        accept: 'application/json',
        'x-requested-with': 'XMLHttpRequest',
        'x-breezy-request': true,
      },
      credentials: 'same-origin',
      redirect: 'manual'
    }])
  })
})
