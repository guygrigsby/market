import React from 'react'
import { css } from 'pretty-lights'
import PropTypes from 'prop-types'
import { searchForCard } from '../services/scryfall.js'
import AsyncAutoComplete from './AutoComplete'
const close = css`
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;

  &:hover,
  &:focus {
    color: black;
    text-decoration: none;
    cursor: pointer;
  }
`
const CardChooser = React.forwardRef(
  ({ matches, setMatches, setCard, ...rest }, ref) => {
    const [cardName, setCardName] = React.useState('')

    React.useEffect(() => {
      if (!cardName) return
      const f = async () => {
        const matches = await searchForCard(cardName)
        console.log('matches', matches)
        setMatches(matches)
      }
      f()
    }, [cardName, setMatches])

    const handleKeyPress = (event) => {
      if (event.key === 'Esc') {
        setMatches(false)
      }
    }
    const showAutocomplete = () => {
      return !matches
    }
    return (
      <AsyncAutoComplete
        ref={ref}
        open={showAutocomplete}
        handleKeyPress={handleKeyPress}
        setCardName={setCardName}
        {...rest}
      />
    )
  },
)
CardChooser.propTypes = {
  matches: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.arrayOf(PropTypes.string),
  ]),
  setMatches: PropTypes.func,
  setCard: PropTypes.func,
}
export default CardChooser
