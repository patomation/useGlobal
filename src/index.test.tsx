import * as React from 'react'
import { useEffect } from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { useGlobal } from './index'

let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container)
  container.remove()
  container = null
})

const SetsInitialState = (): React.ReactElement => {
  interface State {
    color: string
  }
  const [state] = useGlobal<State>({ color: 'red' })
  return (
    <div>{state.color}</div>
  )
}

const GlobalConsumer = (): React.ReactElement => {
  interface State {
    color: string
  }
  const [state] = useGlobal<State>()
  return (
    <div>{state.color}</div>
  )
}

const GlobalSetter = ({ newColor }): React.ReactElement => {
  interface State {
    color: string
  }
  const [state, setState] = useGlobal<State>()
  useEffect(() => {
    setState({ color: newColor })
  }, [newColor])
  return (
    <div>{state.color}</div>
  )
}

const UndoRedo = (): React.ReactElement => {
  interface State {
    color: string
  }
  const [state, setState] = useGlobal<State>()
  return (
    <div>
      <button className='set-yellow' onClick={() => setState({ color: 'yellow' })}>Undo</button>
      <button className='undo' onClick={setState.undo}>Undo</button>
      <button className='redo' onClick={setState.redo}>Redo</button>
      <p>{state.color}</p>
    </div>
  )
}
describe('useGlobal', () => {
  it('starts with an initial state', () => {
    act(() => {
      render(<SetsInitialState />, container)
      expect(container.textContent).toBe('red')
    })
  })

  it('global consumer gets state', () => {
    act(() => {
      render(<GlobalConsumer />, container)
      expect(container.textContent).toBe('red')
    })
  })

  it('sets the global state', () => {
    act(() => {
      render(<GlobalSetter newColor='blue' />, container)
    })
  })

  it('global consumer gets new state', () => {
    act(() => {
      render(<GlobalConsumer />, container)
      expect(container.textContent).toBe('blue')
    })
  })

  it('once global state is set initialState is ignored for the same key', () => {
    act(() => {
      render(<SetsInitialState />, container)
      expect(container.textContent).toBe('blue')
    })
  })

  it('handles undo / redo', () => {
    render(<UndoRedo/>, container)
    const p = document.querySelector('p')
    const setYellow = document.querySelector('.set-yellow')
    const undo = document.querySelector('.undo')
    const redo = document.querySelector('.redo')
    expect(p.innerHTML).toBe('blue')
    setYellow.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(p.innerHTML).toBe('yellow')
    undo.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(p.innerHTML).toBe('blue')
    redo.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(p.innerHTML).toBe('yellow')
  })

  it('handles undo / redo history exceeded', () => {
    render(<UndoRedo/>, container)
    const p = document.querySelector('p')
    const undo = document.querySelector('.undo')
    const redo = document.querySelector('.redo')
    expect(p.innerHTML).toBe('yellow')
    // Click undo 10 times
    for (let i = 0; i <= 10; i++) {
      undo.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    }
    expect(p.innerHTML).toBe('')
    // Click redo 10 times
    for (let i = 0; i <= 10; i++) {
      redo.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    }
    expect(p.innerHTML).toBe('yellow')
  })
})
