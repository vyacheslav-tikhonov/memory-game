function shuffleArray(array: any[]): any[] {
    const length = array.length;
    let tmpElement: any = null;

    for (let i = length - 1; i >= 0; i--) {
        const index = Math.floor(Math.random()*(length));
        tmpElement = array[index];
        array[index] = array[i];
        array[i] = tmpElement;
    }

    return array;
}

export { shuffleArray };