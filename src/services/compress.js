import pako from 'gzip'

export async function compress(body) {
  const compressedData = await compressBody(body)
  console.log('Data Compressed')

  return compressedData
}

function compressBody(body) {
  return new Promise(function (resolve, reject) {
    pako.gzip(body, (err, buffer) => {
      if (err) {
        console.log('Error Zipping')
        reject(err)
      }
      resolve(buffer)
    })
  })
}
