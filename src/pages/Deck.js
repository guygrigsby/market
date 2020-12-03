import React from 'react'
import FetchDeckForm from '../components/FetchDeckForm.js'
import CardList from '../components/CardList'
import { css } from 'pretty-lights'
import ImageBox from '../components/ImageBox.js'
import { useAuth } from '../use-auth'
import { useStore } from '../use-store.js'
const box = css`
  display: flex;
  width: 100%;
  height: 100%;
`

const w50 = css`
  width: 50%;
`

const Deck = ({
  deckName,
  setDeckName,
  deck,
  ttsDeck,
  setDeck,
  setTTSDeck,
  ...rest
}) => {
  const store = useStore()
  const auth = useAuth()
  const noSave = !deck || !deckName || !auth.user
  const write = store.writeDeck
  React.useEffect(() => {
    if (noSave) return
    const f = async () => {
      write(auth.user.email, deck, ttsDeck, deckName).catch((e) =>
        console.error('failed to write deck', deck),
      )
    }
    f()
  }, [write, auth, deckName, deck, ttsDeck, noSave])
  return (
    <>
      <FetchDeckForm
        deckName={deckName}
        setDeckName={setDeckName}
        deck={deck}
        ttsDeck={ttsDeck}
        setDeck={setDeck}
        setTTSDeck={setTTSDeck}
        {...rest}
      />
      <div className={box}>
        <ImageBox
          deck={deck}
          cname={w50}
          chooserModal={true}
          ttsDeck={ttsDeck}
          setTTSDeck={setTTSDeck}
          setDeck={setDeck}
        />
        <CardList cards={deck} cname={w50} />
      </div>
    </>
  )
}

export default Deck
