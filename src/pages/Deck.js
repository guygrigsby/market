import React from 'react'
import FetchDeckForm from '../components/FetchDeckForm.js'
import CardList from '../components/CardList'
import { css } from 'pretty-lights'
import ImageBox from '../components/ImageBox.js'
const box = css`
  display: flex;
  width: 100%;
  height: 100%;
`

const w70 = css`
  flex: 0 0 70%;
`

const Deck = ({
  deckName,
  setDeckName,
  deck,
  ttsDeck,
  setDeck,
  setTTSDeck,
  onError,
  ...rest
}) => {
  const [loading, setLoading] = React.useState(false)
  return (
    <>
      <FetchDeckForm
        deckName={deckName}
        setDeckName={setDeckName}
        deck={deck}
        setLoading={setLoading}
        ttsDeck={ttsDeck}
        setDeck={setDeck}
        setTTSDeck={setTTSDeck}
        {...rest}
      />
      <div className={box}>
        <div>
          <ImageBox
            deck={deck}
            loading={loading}
            chooserModal={true}
            ttsDeck={ttsDeck}
            setTTSDeck={setTTSDeck}
            setDeck={setDeck}
          />
        </div>
        <div className={w70}>
          <CardList cards={deck} />
        </div>
      </div>
    </>
  )
}

export default Deck
