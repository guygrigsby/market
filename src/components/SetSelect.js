import React from 'react'
import { SetFormatter } from '../formatters/table.js'
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
const SetSelect = ({ cardName, onSelect }) => {
  const allSets = useSets()
  const [sets, setSets] = React.useState(Array.from(allSets.values()))

  const resetSets = React.useCallback(() => Array.from(allSets.values()), [
    allSets,
  ])
  React.useEffect(() => {
    if (!cardName) return setSets(resetSets())
    const f = async () => {
      const c = await searchForCard(cardName)
      console.log('cards', c)
      const s = c.map((card) => allSets.get(card.set))
      console.log('sets', s)
      setSets(s)
    }
    f()
  }, [cardName, resetSets, setSets, allSets])

  console.log('sets', sets)
  return (
    <Select
      className={setSelectClass}
      onChange={onSelect}
      getOptionValue={(set) => {
        return set.name
      }}
      getOptionLabel={(set) => {
        return (
          <div className={setCell}>
            <span>{set.name}</span>
            <SetIcon svg={set.logo} className={selectSVG} />
          </div>
        )
      }}
      options={sets ? sets : []}
      theme={selectTheme}
    />
  )
}
export default SetSelect
