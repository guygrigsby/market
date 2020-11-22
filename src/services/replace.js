export const binary = (deck, newC, oldName) => {
  const nd = [...deck]
  for (let i = deck.length / 2; ; ) {
    if (deck[i].name === oldName) {
      nd.splice(i, 1)
      break
    }
    if (deck[i].name > oldName) {
      i = (deck.length - i) / 2 + i
    } else {
      i = i - (deck.length - i) / 2
    }
  }
  let prev = deck.length / 2
  for (let i = prev; ; ) {
    if (i === prev || Math.abs(i - prev) === 1) {
      nd.splice(i, 0, newC)
      break
    }
    if (deck[i].name > oldName) {
      i = (deck.length - i) / 2 + i
    } else {
      i = i - (deck.length - i) / 2
    }
    prev = i
  }
}

export const naive = (deck, newC, oldName) => {
  const nd = [...deck]
  console.log('replacing ', oldName, 'with', newC)
  for (let i = 0; i < deck.length; i++) {
    const card = nd[i]
    if (oldName === card.name) {
      nd.splice(i, 1, newC)
      break
    }
  }

  return nd
}
