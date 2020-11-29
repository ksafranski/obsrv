import React from 'react'
import ReactDOM from 'react-dom'
import obsrv from '../src/obsrv'

const App = () => {
  const store = obsrv({
    data: {
      name: 'John',
      email: 'jsmith@email.com',
      address: {
        street: '123 main'
      },
      tags: ['foo', 'bar']
    },
    computeds: {
      nameLength: (data) => {
        return data.name.length
      },
      emailLength: ({ email }) => {
        return email.length
      }
    },
    actions: {
      save: ({ name, email }) => {
        console.log('action.save', name, email)
      }
    }
  })
  return (
    <div className='App'>
      <form>
        <div className='field'>
          <label>Name:</label>
          <input
            value={store.name}
            onChange={(e) => {
              store.name = e.target.value
            }}
          />
          <div className='length'>{store.computeds.nameLength} characters</div>
        </div>
        <div className='field'>
          <label>Email:</label>
          <input
            value={store.email}
            onChange={(e) => {
              store.email = e.target.value
            }}
          />
          <div className='length'>{store.computeds.emailLength} characters</div>
        </div>
        <div className='field'>
          <label>Street:</label>
          <input
            value={store.address.street}
            onChange={(e) => {
              store.address.street = e.target.value
            }}
          />
        </div>
        <div className='field'>
          <label>Tags:</label>
          <input
            value={store.tags.join(',')}
            onChange={(e) => {
              store.tags = e.target.value.split(',')
            }}
          />
        </div>
        <button
          onClick={(e) => {
            e.preventDefault()
            store.actions.save()
          }}
        >
          Click Me &amp; Check Console
        </button>
      </form>
    </div>
  )
}

const rootElement = document.getElementById('app')
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
)
