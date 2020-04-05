import * as React from 'react'
import { mount } from 'enzyme'

import { useGlobal } from './index'

interface MyState {
  color: string
  nestedObject?: {
    background?: string
  }
}

const ComponentA = (): React.ReactElement => {
  const [state, setState] = useGlobal({
    color: 'red'
    // nestedObject: {
    //   background: '#000000'
    // }
  })

  const { color } = state

  const handleSetColor = (): void => {
    setState({
      color: 'green'
    })
  }

  return (
    <div className='component-a'
      style={{
        color: color
      }}>
      <button onClick={handleSetColor}>Set Color</button>
      {color}
    </div>
  )
}
const ComponentB = (): React.ReactElement => {
  const [state] = useGlobal({ color: '' })

  const { color } = state

  return (
    <div className='component-b'
      style={{
        color: color
      }}>
      {color}
    </div>
  )
}

const App = (): React.ReactElement => {
  return (
    <div>
      <ComponentA />
      <ComponentB />
    </div>
  )
}

describe('useGlobal', () => {
  it('renders and clicks to change color', () => {
    const component = mount(<App />)

    expect(component.find('.component-a').props().style.color).toEqual('red')
    expect(component.find('.component-b').props().style.color).toEqual('red')

    component.find('button').simulate('click')

    expect(component.find('.component-a').props().style.color).toEqual('green')
    expect(component.find('.component-b').props().style.color).toEqual('green')
  })
})
