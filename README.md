
# React NPM Package Starter
A react hook to use global local state

## Installation
```
yarn add my-component
```
or
```
npm install my-component --save
```

## Usage

```typescript
import { useGlobal } from '@patomation/useglobal'

interface MyGlobalState {
  color: string
}

const Component = (): React.ReactElement => {
  const [state, setState] = useGlobal<MyGlobalState>({ color: 'red' })

  const { color } = state

  return (
    <div style={{
      color: color
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
If you are testing with jest you will need to mock ```localStorage```.
I used ```jest-localstorage-mock``` and include it in my jest setup files config. See ```jest.config.js```.

#### ```jest.config.js``` Example
```javascript
module.exports = {
  ...
  setupFiles: [
    'jest-localstorage-mock'
  ]
}

```


