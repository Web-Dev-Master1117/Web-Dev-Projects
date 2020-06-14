const _={
  clamp(number, lower, upper){
    let lowerClampedValue=Math.max(number, lower)
    let clampedValue=Math.min(lowerClampedValue, upper)
    return clampedValue
  },
  inRange(number, start, end){
    if(typeof end === 'undefined'){
      end=start
      start=0
    }
    if(start>end){
      let temp=end
      end=start
      start=temp
    }
    let isInRange=number>=start && number<end?true:false
    return isInRange
  },
  words(string){
    let words=string.split(' ')
    return words
  },
  pad(string, targetLength){
    if(string.length<targetLength){
      let leftLength=Math.floor((targetLength-string.length)/2)
      let rightLength=targetLength-leftLength-string.length
      let paddedString = ' '.repeat(leftLength)
      string = paddedString + string + ' '.repeat(rightLength)
    return string
    }
    else return string
  },
  has(object, key){
    let hasValue=typeof object[key]!=='undefined'?true:false
    return hasValue
  },
  invert(object){
    let invertedObject={}
    for(let key in object){
      invertedObject[object[key]]=key
    }
    return invertedObject
  },
  findKey(object, predicate){
    for(let key in object){
      let value=object[key]
      let predicateReturnValue=predicate(value)
      if(predicateReturnValue) return key
    }
    return undefined
  },
  drop(arr, numToBeDropped){
    if(typeof numToBeDropped === 'undefined'){
      arr.shift()
      return arr
    }
    else{
      for(let i=1;i<=numToBeDropped;i++){
        arr.shift()
      }
      return arr
    }
  }
}




// Do not write or modify code below this line.
module.exports = _;