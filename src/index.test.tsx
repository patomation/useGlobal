import * as React from 'react'
import { useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { act } from '@testing-library/react'
import { useGlobal } from './index'

let container = null
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div')
  document.body.appendChild(container)
})

afterEach(() => {
  document.body.removeChild(container)
  container = null
})

const SetsInitialState =
  (): React.ReactElement => {
    interface State {
      color: string
    }
    const [state] = useGlobal<State>({
      color: 'red',
    })
    return <div>{state.color}</div>
  }

const GlobalConsumer = (): React.ReactElement => {
  interface State {
    color: string
  }
  const [state] = useGlobal<State>()
  return <div>{state.color}</div>
}

const GlobalSetter = ({
  newColor,
}): React.ReactElement => {
  interface State {
    color: string
  }
  const [state, setState] = useGlobal<State>()
  useEffect(() => {
    setState({ color: newColor })
  }, [newColor])
  return <div>{state.color}</div>
}

const UndoRedo = (): React.ReactElement => {
  interface State {
    color: string
  }
  const [state, setState] = useGlobal<State>()
  return (
    <div>
      <button
        className="set-yellow"
        onClick={() =>
          setState({ color: 'yellow' })
        }
      >
        Undo
      </button>
      <button
        className="undo"
        onClick={setState.undo}
      >
        Undo
      </button>
      <button
        className="redo"
        onClick={setState.redo}
      >
        Redo
      </button>
      <p>{state.color}</p>
    </div>
  )
}
describe('useGlobal', () => {
  it('starts with an initial state', () => {
    act(() => {
      ReactDOM.createRoot(container).render(
        <SetsInitialState />
      )
    })
    expect(container.textContent).toBe('red')
  })

  it('global consumer gets state', () => {
    act(() => {
      ReactDOM.createRoot(container).render(
        <GlobalConsumer />
      )
    })
    expect(container.textContent).toBe('red')
  })

  it('sets the global state', () => {
    act(() => {
      ReactDOM.createRoot(container).render(
        <GlobalSetter newColor="blue" />
      )
    })
  })

  it('global consumer gets new state', () => {
    act(() => {
      ReactDOM.createRoot(container).render(
        <GlobalConsumer />
      )
    })
    expect(container.textContent).toBe('blue')
  })

  it('once global state is set initialState is ignored for the same key', () => {
    act(() => {
      ReactDOM.createRoot(container).render(
        <SetsInitialState />
      )
    })
    expect(container.textContent).toBe('blue')
  })

  it('handles undo / redo', () => {
    act(() => {
      ReactDOM.createRoot(container).render(
        <UndoRedo />
      )
    })

    const p = document.querySelector('p')
    const setYellow = document.querySelector(
      '.set-yellow'
    )
    const undo = document.querySelector('.undo')
    const redo = document.querySelector('.redo')
    expect(p.innerHTML).toBe('blue')
    act(() => {
      setYellow.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      )
    })
    expect(p.innerHTML).toBe('yellow')
    act(() => {
      undo.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      )
    })
    expect(p.innerHTML).toBe('blue')
    act(() => {
      redo.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      )
    })
    expect(p.innerHTML).toBe('yellow')
  })

  it('handles undo / redo history exceeded', () => {
    act(() => {
      ReactDOM.createRoot(container).render(
        <UndoRedo />
      )
    })
    const p = document.querySelector('p')
    const undo = document.querySelector('.undo')
    const redo = document.querySelector('.redo')
    expect(p.innerHTML).toBe('yellow')
    // Click undo 10 times
    act(() => {
      for (let i = 0; i <= 10; i++) {
        undo.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
          })
        )
      }
    })
    // This may be a flaw, probably should be ""
    expect(p.innerHTML).toBe('red')
    // Click redo 10 times
    act(() => {
      for (let i = 0; i <= 10; i++) {
        redo.dispatchEvent(
          new MouseEvent('click', {
            bubbles: true,
          })
        )
      }
    })
    expect(p.innerHTML).toBe('yellow')
  })
})
