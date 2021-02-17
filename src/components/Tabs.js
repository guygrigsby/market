import React from 'react'
import { css } from 'pretty-lights'
const tab = css`
  padding: 0.25em;
  background-color: silver;
`
const tabHeader = css`
  display: flex;
  justify-context: space-evenly;
`
const tabButton = css`
  flex: 1 1 auto;
  border-radius: 5px 5px 0 0;
  &:active {
    color: light-gray;
  }
`
const Tabs = ({ children, activeTab, setActiveTab }) => (
  <div>
    <div className={tabHeader}>
      {React.Children.map(children, (child, i) => (
        <button
          disabled={activeTab === i}
          className={tabButton}
          onClick={() => setActiveTab(i)}
        >
          {child.props.name}
        </button>
      ))}
    </div>
    {React.Children.toArray(children).map((e, i) => {
      return (
        <div key={`tab-${i}`}>{activeTab === i ? <Tab>{e}</Tab> : null}</div>
      )
    })}
  </div>
)

const Tab = ({ children, active }) => {
  return <div className={tab}>{React.Children.only(children)}</div>
}
export default Tabs
