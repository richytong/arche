# Arche
🌄 React without JSX

```javascript
const P = Arche('p')
const Div = Arche('div')
const Button = Arche('button')

const Clicker = e(({ message }) => {
  const [clicked, setClicked] = React.useState(0)
  return Div({
    id: 'clicker',
    style: styles.div,
  }, [
    P(null, [`${message}: clicked ${clicked} times`]),
    Button({
      onClick: () => {
        setClicked(clicked + 1)
      },
    }, ['click']),
  ])
})

ReactDOM.render(
  Clicker({ message: 'You got this!' }),
  document.getElementById('root'),
)
```
