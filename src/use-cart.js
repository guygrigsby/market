import React from 'react'

const context = React.createContext()

export const useCart = () => {
  return React.useContext(context)
}

export const ProvideShoppingCart = ({ children }) => {
  const cart = useProvideCart()
  return <context.Provider value={cart}>{children}</context.Provider>
}

const useProvideCart = () => {
  const [items, setItems] = React.useState(null)
  const add = (item) => {
    setItems((prev) => {
      const n = [...prev]
      n.push(item)
      setItems(n)
    })
  }
  const remove = (item) => {
    setItems((prev) => {
      const n = [...prev]
      const i = prev.indexOf(item)
      n.splice(i, 1)
      setItems(n)
    })
  }
  return {
    items,
    add,
    remove,
  }
}
