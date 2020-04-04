import { useState, useEffect } from 'react'

export interface SetState {
  (newState: object, undoRedo?: boolean): void
  undo: () => void
  redo: () => void
}

export interface State {
  [key: string]: string | number
}

export type UseGlobal = (initialState?: object) => [
  State,
  SetState
]

// array of listeners
const listeners = []
// state object
let state = {}
// undo redo history
const undoHistory = [JSON.parse(JSON.stringify(state))]
let redoHistory = []
// set state handler
const setState: SetState = (newState, undoRedo) => {
  if (undoRedo) {
    state = { ...newState }
  } else {
    undoHistory.push(JSON.parse(JSON.stringify(state)))
    // Reset redo history
    redoHistory = []
    // Merge state with new state
    state = { ...state, ...newState }
  }
  // BACKUP TO LOCAL STORAGE
  localStorage.setItem('state', JSON.stringify(state))

  // trigger events for each subscribed listener
  listeners.forEach((listener) => {
    // Pass through the new state object to subscriber's local state
    listener(state)
  })
}

setState.undo = (): void => {
  console.log(undoHistory.length)
  console.log(undoHistory)
  if (undoHistory.length > 0) {
    console.log('undo', undoHistory.length)
    // use last undo
    const lastState = undoHistory[undoHistory.length - 1]
    // Remove from undo history
    undoHistory.pop()
    // Add to redo history
    redoHistory.push(lastState)
    setState(lastState, true)
  }
}

setState.redo = (): void => {
  if (redoHistory.length > 0) {
    console.log('redo')
    // use last undo
    const lastState = redoHistory[redoHistory.length - 1]
    // Remove from redo history
    redoHistory.pop()
    // Add back to undo history
    undoHistory.push(lastState)
    setState(lastState, true)
  }
}

const storedState = JSON.parse(localStorage.getItem('state')) || {}

export const useGlobal: UseGlobal = (initialState: object) => {
  // If initial state is defined
  if (initialState !== undefined) {
    // For each key in initial state object
    Object.keys(initialState || {}).forEach(key => {
      // If state key value is undefined then set it with our initial value
      if (state[key] === undefined) {
        // Use localStorage or  initial value
        state[key] = storedState[key] || initialState[key]
      }
    })
  }

  // Create new listener useState handler function
  const newListener = useState()[1]

  // Use effect once
  useEffect(() => {
    // Store listener into array
    listeners.push(newListener)

    // Track index/id so we can remove the listener later
    const id = listeners.length - 1

    // Un-mount
    return (): void => {
      // Unsubscribe listener
      listeners.splice(id, 1)
    }
  }, [newListener])

  // Return object and handler function
  return [state, setState]
}
