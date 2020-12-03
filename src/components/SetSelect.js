import React from 'react'
import { css } from 'pretty-lights'
import { searchForCard } from '../services/scryfall.js'
import { useSets } from '../use-sets'
import Select from 'react-select'
import SetIcon from './SetIcon'

const setCell = css`
  flex: 1;
  max-height: 50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`
const setSelectClass = css`
  min-width: 300px;
`

const selectSVG = css`
  fill: black;
  transform: scale(0.15);
`

const selectTheme = (theme) => ({
  ...theme,
  borderRadius: '1px',
})
const SetSelect = ({ cardName, onSelect, selected, setSelected }) => {
  const allSets = useSets()
  const [sets, setSets] = React.useState(Array.from(allSets.values()))
  const [matchingCards, setMatchingCards] = React.useState(null)

  React.useEffect(() => {
    if (!cardName) return setSets(Array.from(allSets.values()))
    const f = async () => {
      const c = await searchForCard(cardName)
      const s = c.map((card) => allSets.get(card.set))
      console.log('settings sets', s)
      setSets(s)
      setMatchingCards(c)
    }
    f()
  }, [cardName, setSets, allSets])

  const handleChange = (set) => {
    console.log('change', set, 'matched ', matchingCards)
    for (let i = 0; i < matchingCards.length; i++) {
      const c = matchingCards[i]
      if (c.set === set.code) {
        console.log('found match ', c)
        onSelect(c)
        setSelected(set)
        return
      }
    }
  }

  return (
    <Select
      className={setSelectClass}
      value={selected}
      onChange={(val) => handleChange(val)}
      getOptionValue={(set) => {
        return set.name
      }}
      getOptionLabel={(set) => {
        return (
          <div className={setCell}>
            {set && set.logo ? (
              <>
                <span>{set.name}</span>
                <SetIcon svg={set.logo} className={selectSVG} />
              </>
            ) : null}
          </div>
        )
      }}
      options={sets ? sets : []}
      theme={selectTheme}
      clearable
    />
  )
}
export default SetSelect
