# useGlobal

A react hook for global local state

features:

- multiple listener system
- undo/redo
- Generic Types support

## Installation

```
yarn add my-component
```

or

```
npm install my-component --save
```

## Usage

```javascript
import { useGlobal } from '@patomation/useglobal'

const Component = (): React.ReactElement => {
  const [state, setState] = useGlobal({ color: 'red' })

  const { color } = state

  return (
    <div style={{
      color: color as string
    }}>

      {`My Color is ${color}`}

      <button onClick={(): void => {
        setState({ color: 'blue' })
      }}>
        {'Change Color'}
      </button>

    </div>
  )
}
```

## Know issues

### Jest testing

If you are testing with jest you will need to mock `localStorage`.
I used `jest-localstorage-mock` and include it in my jest setup files config. See `jest.config.js`.

#### `jest.config.js` Example

```javascript
module.exports = {
  ...
  setupFiles: [
    'jest-localstorage-mock'
  ]
}

```
