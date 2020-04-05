import * as React from 'react'
import { mount } from 'enzyme'

import { useGlobal } from './index'

interface MyState {
  color: string
  nestedObject?: {
    background: string
  }
}

const Component = (): React.ReactElement => {
  const [state, setState] = useGlobal<MyState>({
    color: 'red',
    nestedObject: {
      background: '#000000'
    }
  })

  const { color } = state

  return (
    <button
      onClick={() => {
        setState({
          color: 'green'
        })
      }}
      style={{
        color: color,
        background: state.nestedObject.background
      }}>
      {color}
    </button>
  )
}

describe('useGlobal', () => {
  it('renders and clicks to change color', () => {
    const component = mount(<Component />)
    expect(component.find('button').props().style.color).toEqual('red')
    component.simulate('click')
    expect(component.find('button').props().style.color).toEqual('green')
  })
})
