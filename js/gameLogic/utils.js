function randomRound(number) {
    let returnNum = Math.floor(number);
    let numberRemainder = number - returnNum;
    if (Math.random() < numberRemainder) {
        returnNum += 1;
    }
    return returnNum;
}
