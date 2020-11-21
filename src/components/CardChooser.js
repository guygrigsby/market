import React from 'react'
import PropTypes from 'prop-types'
import { searchForCard } from '../services/scryfall.js'
import AsyncAutoComplete from './AutoComplete'

const CardChooser = ({ setMatches, setCard, ...rest }) => {
  const [cardName, setCardName] = React.useState(null)

  React.useEffect(() => {
    if (!cardName) return
    const f = async () => {
      const m = await searchForCard(cardName)
      setMatches(m.data)
    }
    f()
  }, [cardName, setMatches])
  return <AsyncAutoComplete setCardName={setCardName} {...rest} />
}

CardChooser.propTypes = {
  setMatches: PropTypes.func,
  setCard: PropTypes.func,
}
export default CardChooser
