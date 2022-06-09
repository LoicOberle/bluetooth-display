function generateColors(){
    let colors=[]
    let possibilities=["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F"]
    for (let i = 0; i < possibilities.length; i++) {
        for (let j = 0; j < possibilities.length; j++) {
            for (let k = 0; k < possibilities.length; k++) {
               colors.push(possibilities[i]+possibilities[j]+possibilities[k]+"0")
            }
            
        }
        
    }
    return colors
}

console.log(generateColors());