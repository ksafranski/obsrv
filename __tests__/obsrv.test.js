import obsrv from '../src/obsrv'
import React from 'react'
import { shallow, configure } from 'enzyme'

import Adapter from 'enzyme-adapter-react-16'

configure({ adapter: new Adapter() })

const storeFixture = {
  data: {
    foo: 'bar'
  },
  computeds: {
    fizz: ({ foo }) => `${foo}-computed`
  },
  actions: {
    biz: ({ foo }) => `return ${foo} from action`
  }
}

describe('obsrv', () => {
  it('renders a property from data into the component', () => {
    const Test = () => {
      const store = obsrv(storeFixture)
      return <div>{store.foo}</div>
    }
    expect(
      shallow(<Test />)
        .find('div')
        .html()
    ).toContain('bar')
  })
  it('renders a property from data into the component after modified', () => {
    const Test = () => {
      const store = obsrv(storeFixture)
      if (store.foo === 'bar') {
        store.foo = 'not-bar'
      }
      return <div>{store.foo}</div>
    }
    expect(
      shallow(<Test />)
        .find('div')
        .html()
    ).toContain('not-bar')
  })
  it('renders a computed from data into the component', () => {
    const Test = () => {
      const store = obsrv(storeFixture)
      return <div>{store.computeds.fizz}</div>
    }
    expect(
      shallow(<Test />)
        .find('div')
        .html()
    ).toContain('bar-computed')
  })
  it('renders a computed from data into the component after data changed', () => {
    const Test = () => {
      const store = obsrv(storeFixture)
      if (store.foo === 'bar') {
        store.foo = 'not-bar'
      }
      return <div>{store.computeds.fizz}</div>
    }
    expect(
      shallow(<Test />)
        .find('div')
        .html()
    ).toContain('not-bar-computed')
  })
  it('calls an action and sucessfully executes', () => {
    const Test = () => {
      const store = obsrv(storeFixture)
      const fooActionResponse = store.actions.biz()
      return <div>{fooActionResponse}</div>
    }
    expect(
      shallow(<Test />)
        .find('div')
        .html()
    ).toContain('return bar from action')
  })
})
