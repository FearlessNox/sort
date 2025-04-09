function mergeSortWithTiming(array) {
    function merge(array, start, mid, end) {
        let leftIndex = start, rightIndex = mid + 1, auxIndex = 0;
        let auxArray = new Array(end - start + 1);

        while (leftIndex <= mid && rightIndex <= end) {
            if (array[leftIndex] <= array[rightIndex]) {
                auxArray[auxIndex] = array[leftIndex];
                leftIndex++;
            } else {
                auxArray[auxIndex] = array[rightIndex];
                rightIndex++;
            }
            auxIndex++;
        }

        while (leftIndex <= mid) {
            auxArray[auxIndex] = array[leftIndex];
            auxIndex++;
            leftIndex++;
        }

        while (rightIndex <= end) {
            auxArray[auxIndex] = array[rightIndex];
            auxIndex++;
            rightIndex++;
        }

        for (let i = 0; i < auxArray.length; i++) {
            array[start + i] = auxArray[i];
        }
    }

    function mergeSort(array, start, end) {
        if (start < end) {
            let mid = Math.floor((start + end) / 2);
            mergeSort(array, start, mid);
            mergeSort(array, mid + 1, end);
            merge(array, start, mid, end);
        }
    }

    mergeSort(array, 0, array.length - 1);
}

let array = [];
for (let i = 0; i < 1000000; i++) {
    array.push(Math.floor(Math.random() * 1000000));
}

console.time("MergeSort Time");

mergeSortWithTiming(array);
console.timeEnd("MergeSort Time");
console.log("Sorted Array:", array);