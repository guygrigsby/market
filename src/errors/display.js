const matcher = new RegExp(
  /* eslint-disable no-useless-escape */
  `failed to build deck rpc error: code = NotFound desc = "projects\/marketplace-c87d0\/databases\/\(default\)\/documents\/cards\/(.+)" not found`,
)

export const decodeResponse = (res) => {
  console.log(res)
  const m = res.match(matcher)
  console.log(m)
  return m && m.length > 0 ? `Failed to build deck: ${m[1]}` : res
}
