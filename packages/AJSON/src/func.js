const string2Object = (str) => {
  return eval('('+str+')')
}

const object2BeautifulString = (o) => {
  let result = '{'

  const dfs = (obj) => {
    for (let key in obj) {
      // @ts-ignore
      let tmp = obj[key]
      if (typeof tmp === 'object') {
        result += `${key}: {`
        dfs(tmp)
      } else {
        result += `${key}: "${tmp}",`
      }
    }
    result += '},'
  }

  dfs(o)
  if(result[result.length-1] === ',') {
    result = result.slice(0, -1)
  }

  return result
}

const object2String = (o) => {
  let result = '{\n'

  const dfs = (obj, indent) => {
    let textIndent = ''
    for (let i = 0; i < indent; i++) {
      textIndent += ' '
    }
    for (let key in obj) {
      // @ts-ignore
      let tmp = obj[key]
      if (typeof tmp === 'object') {
        result += `${textIndent}${key} : {\n`
        dfs(tmp, indent + 4)
      } else {
        result += `${textIndent}${key} : "${tmp}", \n`
      }
    }
    if (indent <= 4) {
      result += `}\n`
    } else {
      result += `${textIndent.slice(0, textIndent.length / 2)}}\n`
    }
  }

  dfs(o, 4)
  return result
}

export {
  string2Object,
  object2BeautifulString,
  object2String
}