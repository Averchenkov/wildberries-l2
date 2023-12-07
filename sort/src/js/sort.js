//https://dev.to/christinamcmahon/common-sorting-algorithms-in-javascript-58a7

const getAllSortFunctions = () => [
    bubbleSort,
    selectionSort,
    insertionSort,
    mergeSort,
    quickSort
]

function bubbleSort(array, addScene) {
    const sortName = "buble"
    let { length } = array;
    
    for (let i = 0; i < length - 1; i++){
        let isEnd = true
        for (let j = 0; j <= length - i - 2; j++){
            if (array[j] > array[j+1]){
                swap(array, j, j + 1)
                addScene({
                    sortName, 
                    array,
                    indexNumber: [j + 1],
                    redColumnes: [j + 1, j]
                })
                isEnd = false
            } else {
                addScene({
                    sortName, 
                    array,
                    indexNumber: [j + 1],
                    greenColumnes: [j + 1, j]
                })
            }

        }
        addScene({
            sortName, 
            array,
            indexNumber: [0]
        })
        if (isEnd) break
    }
}

function selectionSort(array, addScene) {
    const sortName = "selection"
    const { length } = array;
    for (let i = 0; i < length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < length; j++) {
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
            addScene({
                sortName,
                array,
                indexNumber: [j],
                greenColumnes: [i, minIndex]
            })
        }
        if (i !== minIndex) {
            swap(array, i, minIndex)
            addScene({
                sortName,
                array,
                indexNumber: [length - 1],
                redColumnes: [i, minIndex]
            })
        }
        
    }
    addScene({
        sortName,
        array,
        indexNumber: [length - 1],
    })
}

function insertionSort(array, addScene) {
    const sortName = "insertion"
    const { length } = array;
    for (let i = 1; i < length; i++) {
        let j = i;

        addScene({
            sortName,
            array,
            indexNumber: [j],
            greenColumnes: [i]
        })
        while (j > 0 && array[j - 1] > array[j]) {
            swap(array, j, j - 1)
            j--;

            addScene({
                sortName,
                array,
                indexNumber: [j],
                greenColumnes: [i],
                redColumnes: [j + 1, j]
            })
        }
    }
    addScene({
        sortName,
        array,
        indexNumber: [length - 1]
    })
}

function mergeSort(array, addScene, start = 0, end = array.length - 1) {
    const sortName = "merge"
    if (end - start > 0) {
        const middle = Math.floor((start + end) / 2);
        mergeSort(array, addScene, start, middle);
        mergeSort(array, addScene, middle + 1, end);

        let i = start;
        let j = middle + 1;
        const result = [];
        addScene({
            sortName,
            array,
            indexNumber: [start],
            greenColumnes: [start, end],
        })
        while (i <= middle && j <= end) {
            if (array[i] < array[j]) {
                result.push(array[i]);
                addScene({
                    sortName,
                    array,
                    indexNumber: [start + result.length - 1],
                    greenColumnes: [start, end],
                    redColumnes: [i]
                })
                i++
            } else {
                result.push(array[j]);
                addScene({
                    sortName,
                    array,
                    indexNumber: [start + result.length - 1],
                    greenColumnes: [start, end],
                    redColumnes: [j]
                })
                j++
            }
        }

        const lastElements = i <= middle ? fromTo(i, middle) : fromTo(j, end)
        for (const element of lastElements) {
            result.push(array[element])
            addScene({
                sortName,
                array,
                indexNumber: [start + result.length - 1],
                greenColumnes: [start, end],
                redColumnes: [element]
            })
        }

        array.splice(start, result.length, ...result)
        addScene({
            sortName,
            array,
            indexNumber: [start + result.length - 1],
        })
    }
}

// Возвращает массив в виде [start, ... , end]
function fromTo(start, end) {
    return [ ...Array(end - start + 1).keys() ].map(i => i + start)
}

function swap(array, left, right) {
    [array[left], array[right]] = [array[right], array[left]]
}

function partitionMiddle(array, addScene, low, high) {
    const sortName = "quick"
    const middle = Math.floor((low + high) / 2);
    let pivot = array[middle];
    let i = low;
    let j = high;

    while(i <= j) {
        while(array[j] > pivot){
            j--
            addScene({
                sortName,
                array,
                indexNumber: [j, i],
            })
        }

        while(array[i] < pivot){
            i++    
            addScene({
                sortName,
                array,
                indexNumber: [j, i],
                greenColumnes: [j]
            })
        }
        addScene({
            sortName,
            array,
            indexNumber: [j, i],
            greenColumnes: [j, i]
        })
        
        if(i <= j){
            swap(array, i, j);
            addScene({
                sortName,
                array,
                indexNumber: [j, i],
                redColumnes: [j, i]
            })
            i++;
            j--;
        }
    }

    return i;
}
  
function quickSort(array, addScene, low = 0, high = array.length - 1) {
    if (low >= high) {
        return;
    }
    
    const pivot = partitionMiddle(array, addScene, low, high);
    
    quickSort(array, addScene, low, pivot - 1);
    quickSort(array, addScene, pivot, high);
    addScene({
        sortName: "quick",
        array,
    })
}

export default getAllSortFunctions