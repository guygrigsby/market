import React from 'react'
import { css } from 'pretty-lights'

const wrapper = css`
  flex: 1;
  flex-direction: column;
  display: flex;
`
const tab = css`
  flex: 1 1 auto;
  padding: 0.5em;
  border: 1px solid #333;
  border-top: none;
  background-color: #f2f2f2;
  overflow: hidden;
  border-radius: 1px;
`
const tabHeader = css`
  flex: 1 1 auto;
  display: flex;
  justify-context: space-evenly;
`
const inactiveButton = css`
  flex: 1 1 auto;
  border-radius: 5px 5px 0 0;
`
const activeButton = css`
  background-color: #f2f2f2;
  border: 1px solid #333;
  border-bottom: none;
  color: #333;
  flex: 1 1 auto;
  border-radius: 5px 5px 0 0;
`
const Tabs = ({ children, activeTab, setActiveTab }) => (
  <div className={wrapper}>
    <div className={tabHeader}>
      {React.Children.map(children, (child, i) => (
        <button
          className={activeTab === i ? activeButton : inactiveButton}
          onClick={() => setActiveTab(i)}
        >
          {child.props.name}
        </button>
      ))}
    </div>
    {React.Children.toArray(children).map((e, i) => {
      return activeTab === i ? <Tab key={`tab-${i}`}>{e}</Tab> : null
    })}
  </div>
)

const Tab = ({ children, active }) => {
  return <div className={tab}>{React.Children.only(children)}</div>
}
export default Tabs
