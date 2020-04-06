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
  const [state] = useGlobal({ color: '' })

  return (
    <div className='component-a'
      style={{
        color: state.color
      }}>
      {state.color}
    </div>
  )
}

const ComponentB = (): React.ReactElement => {
  const [state] = useGlobal({ color: '' })

  return (
    <div className='component-b'
      style={{
        color: state.color
      }}>
      {state.color}
    </div>
  )
}

const App = (): React.ReactElement => {
  const setState = useGlobal({ color: 'red' })[1]

  const handleSetColor = (): void => {
    setState({
      color: 'green'
    })
  }

  const handleUndo = (): void => {
    setState.undo()
  }

  const handleRedo = (): void => {
    setState.redo()
  }

  return (
    <div>
      <button className='set-color-button' onClick={handleSetColor}>Set Color</button>
      <button className='undo-button' onClick={handleUndo}>Set Color</button>
      <button className='redo-button' onClick={handleRedo}>Set Color</button>
      <ComponentA />
      <ComponentB />
    </div>
  )
}

const NoInitialState = (): React.ReactElement => {
  const [state] = useGlobal<MyState>()

  return (
    <div style={{ color: state.color }}>{'No Initial State'}</div>
  )
}

const UndefinedKey = (): React.ReactElement => {
  const [state] = useGlobal({ color: undefined, background: 'purple' })

  return (
    <div style={{ color: state.color, background: state.background }}>No Initial State</div>
  )
}

const StartsUndefinedSetsStateLater = (): React.ReactElement => {
  interface State {
    width: string
  }

  const [state, setState] = useGlobal<State>({ width: '10%' })

  const handleSetState = (): void => {
    setState({ width: '55%' })
  }

  return (
    <div style={{ width: state.width }}>
      Starts Undefined Sets State Later
      <button onClick={handleSetState} />
    </div>
  )
}

describe('useGlobal', () => {
  const appComponent = mount(<App />)

  it('renders and clicks to change color', () => {
    expect(appComponent.find('.component-a').props().style.color).toEqual('red')
    expect(appComponent.find('.component-b').props().style.color).toEqual('red')

    appComponent.find('.set-color-button').simulate('click')

    expect(appComponent.find('.component-a').props().style.color).toEqual('green')
    expect(appComponent.find('.component-b').props().style.color).toEqual('green')
  })

  it('undo', () => {
    appComponent.find('.undo-button').simulate('click')
    expect(appComponent.find('.component-a').props().style.color).toEqual('red')
    expect(appComponent.find('.component-b').props().style.color).toEqual('red')
  })

  it('redo', () => {
    appComponent.find('.redo-button').simulate('click')
    expect(appComponent.find('.component-a').props().style.color).toEqual('green')
    expect(appComponent.find('.component-b').props().style.color).toEqual('green')
  })

  it('undo === 0 does not break', () => {
    appComponent.find('.undo-button').simulate('click')
    appComponent.find('.undo-button').simulate('click')
    appComponent.find('.undo-button').simulate('click')
    expect(appComponent.find('.component-a').props().style.color).toEqual('red')
    expect(appComponent.find('.component-b').props().style.color).toEqual('red')
  })

  it('redo === 0 does not break', () => {
    appComponent.find('.redo-button').simulate('click')
    appComponent.find('.redo-button').simulate('click')
    appComponent.find('.redo-button').simulate('click')
    expect(appComponent.find('.component-a').props().style.color).toEqual('green')
    expect(appComponent.find('.component-b').props().style.color).toEqual('green')
  })

  it('works without an initialState', () => {
    const component = mount(<NoInitialState/>)
    component.unmount()
  })

  it('removes listener when un-mounting a component', () => {
    appComponent.unmount()
  })

  it('works with undefined keys?', () => {
    const component = mount(<UndefinedKey/>)
    expect(component.find('div').props().style.color).toEqual('green')
    expect(component.find('div').props().style.background).toEqual('purple')
    component.unmount()
  })

  it('handles starting as undefined and only being defined with setState later', () => {
    console.log('------------------------------ my new test')

    const component = mount(<StartsUndefinedSetsStateLater/>)
    expect(component.find('div').props().style.width).toEqual('10%')
    component.find('button').simulate('click')
    expect(component.find('div').props().style.width).toEqual('55%')
    component.unmount()
  })
})
