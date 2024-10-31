function compareWeights(weight1, weight2, unit1, unit2) {
    let w1 = weight1
    let w2 = weight2
    if (unit1 === unit2) {
        if (w1 > w2) {
            return 'g'
        } else if (w1 === w2) {
            return 'e'
        } else return 's'
    } else if (unit1 !== unit2) {
        if (unit1 === 'pound') {
            w1 = (weight1 * 0.45359237).toFixed(0)
            if (w1 > w2) {
                return 'g'
            } else if (w1 === w2) {
                return 'e'
            } else return 's'
        } else if (unit2 === 'pound') {
            w2 = (weight2 * 0.45359237).toFixed(0)
            if (w1 > w2) {
                return 'g'
            } else if (w1 === w2) {
                return 'e'
            } else return 's'
        } else {
            return NaN
        }
    }
}

module.exports = {compareWeights}