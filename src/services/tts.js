export const getDecklist = (tts)=> {
  const names = tts.ObjectStates.map((os)=>os.Nickname)
  //const images = tts.ObjectStates.reduce((acc, os) => {
  //  acc.push([...Object.values(os.CustomDeck)])
  //  return acc
  //}, [])
  return names.Join('\n')
}
