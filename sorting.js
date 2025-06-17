// Utility function to generate random array
function generateRandomArray(size) {
    return Array.from({ length: size }, () => Math.floor(Math.random() * 100) + 1);
}

// Utility function to swap elements
async function swap(array, i, j) {
    if (shouldStop) {
        return false;
    }
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
    arrayChanges++;
    await updateVisualization(array, [i, j]);
    return true;
}

// Utility function to update visualization
async function updateVisualization(array, comparing = [], sorted = []) {
    if (shouldStop) {
        return false;
    }
    const container = document.getElementById('array-container');
    container.innerHTML = '';
    
    const maxValue = Math.max(...array);
    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        if (comparing.includes(index)) {
            bar.classList.add('comparing');
        }
        if (sorted.includes(index)) {
            bar.classList.add('sorted');
        }
        bar.style.height = `${(value / maxValue) * 100}%`;
        container.appendChild(bar);
    });
    
    await new Promise(resolve => setTimeout(resolve, 50));
    return true;
}

// Bogo Sort
async function bogoSort(array) {
    while (!isSorted(array) && !shouldStop) {
        if (shouldStop) break;
        await shuffle(array);
        if (shouldStop) break;
        await updateVisualization(array);
    }
}

function isSorted(array) {
    for (let i = 1; i < array.length; i++) {
        if (array[i] < array[i - 1]) return false;
    }
    return true;
}

async function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        if (shouldStop) return;
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Bubble Sort
async function bubbleSort(array) {
    const n = array.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (array[j] > array[j + 1]) {
                await swap(array, j, j + 1);
            }
        }
    }
}

// Insertion Sort
async function insertionSort(array) {
    for (let i = 1; i < array.length; i++) {
        let key = array[i];
        let j = i - 1;
        while (j >= 0 && array[j] > key) {
            array[j + 1] = array[j];
            await updateVisualization(array, [j, j + 1]);
            j--;
        }
        array[j + 1] = key;
        await updateVisualization(array);
    }
}

// Merge Sort
async function mergeSort(array, start = 0, end = array.length - 1) {
    if (start < end) {
        const mid = Math.floor((start + end) / 2);
        await mergeSort(array, start, mid);
        await mergeSort(array, mid + 1, end);
        await merge(array, start, mid, end);
    }
}

async function merge(array, start, mid, end) {
    const left = array.slice(start, mid + 1);
    const right = array.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;
    
    while (i < left.length && j < right.length) {
        if (left[i] <= right[j]) {
            array[k] = left[i];
            i++;
        } else {
            array[k] = right[j];
            j++;
        }
        await updateVisualization(array, [k]);
        k++;
    }
    
    while (i < left.length) {
        array[k] = left[i];
        await updateVisualization(array, [k]);
        i++;
        k++;
    }
    
    while (j < right.length) {
        array[k] = right[j];
        await updateVisualization(array, [k]);
        j++;
        k++;
    }
}

// Quick Sort
async function quickSort(array, start = 0, end = array.length - 1) {
    if (start < end) {
        const pivotIndex = await partition(array, start, end);
        await quickSort(array, start, pivotIndex - 1);
        await quickSort(array, pivotIndex + 1, end);
    }
}

async function partition(array, start, end) {
    const pivot = array[end];
    let i = start - 1;
    
    for (let j = start; j < end; j++) {
        if (array[j] <= pivot) {
            i++;
            await swap(array, i, j);
        }
    }
    
    await swap(array, i + 1, end);
    return i + 1;
}

// Selection Sort
async function selectionSort(array) {
    for (let i = 0; i < array.length - 1; i++) {
        let minIndex = i;
        for (let j = i + 1; j < array.length; j++) {
            if (array[j] < array[minIndex]) {
                minIndex = j;
            }
        }
        if (minIndex !== i) {
            await swap(array, i, minIndex);
        }
    }
}

// Shell Sort
async function shellSort(array) {
    const n = array.length;
    for (let gap = Math.floor(n / 2); gap > 0; gap = Math.floor(gap / 2)) {
        for (let i = gap; i < n; i++) {
            const temp = array[i];
            let j;
            for (j = i; j >= gap && array[j - gap] > temp; j -= gap) {
                array[j] = array[j - gap];
                await updateVisualization(array, [j, j - gap]);
            }
            array[j] = temp;
            await updateVisualization(array);
        }
    }
}

// Heap Sort
async function heapSort(array) {
    const n = array.length;
    
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(array, n, i);
    }
    
    for (let i = n - 1; i > 0; i--) {
        await swap(array, 0, i);
        await heapify(array, i, 0);
    }
}

async function heapify(array, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;
    
    if (left < n && array[left] > array[largest]) {
        largest = left;
    }
    
    if (right < n && array[right] > array[largest]) {
        largest = right;
    }
    
    if (largest !== i) {
        await swap(array, i, largest);
        await heapify(array, n, largest);
    }
}

// Counting Sort
async function countingSort(array) {
    const max = Math.max(...array);
    const count = new Array(max + 1).fill(0);
    const output = new Array(array.length);
    
    // Count occurrences
    for (let i = 0; i < array.length; i++) {
        count[array[i]]++;
    }
    
    // Calculate cumulative count
    for (let i = 1; i <= max; i++) {
        count[i] += count[i - 1];
    }
    
    // Build output array
    for (let i = array.length - 1; i >= 0; i--) {
        output[count[array[i]] - 1] = array[i];
        count[array[i]]--;
    }
    
    // Copy back to original array
    for (let i = 0; i < array.length; i++) {
        array[i] = output[i];
        await updateVisualization(array, [i]);
    }
}

// Bucket Sort
async function bucketSort(array) {
    const n = array.length;
    const max = Math.max(...array);
    const min = Math.min(...array);
    const range = max - min;
    const buckets = Array.from({ length: n }, () => []);
    
    // Distribute elements into buckets
    for (let i = 0; i < n; i++) {
        const bucketIndex = Math.floor(((array[i] - min) / range) * (n - 1));
        buckets[bucketIndex].push(array[i]);
    }
    
    // Sort individual buckets
    for (let i = 0; i < n; i++) {
        buckets[i].sort((a, b) => a - b);
    }
    
    // Merge buckets back into array
    let index = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < buckets[i].length; j++) {
            array[index] = buckets[i][j];
            await updateVisualization(array, [index]);
            index++;
        }
    }
}

// Radix Sort
async function radixSort(array) {
    const max = Math.max(...array);
    let exp = 1;
    
    while (Math.floor(max / exp) > 0) {
        await countingSortForRadix(array, exp);
        exp *= 10;
    }
}

async function countingSortForRadix(array, exp) {
    const n = array.length;
    const output = new Array(n);
    const count = new Array(10).fill(0);
    
    // Count occurrences
    for (let i = 0; i < n; i++) {
        count[Math.floor(array[i] / exp) % 10]++;
    }
    
    // Calculate cumulative count
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }
    
    // Build output array
    for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(array[i] / exp) % 10;
        output[count[digit] - 1] = array[i];
        count[digit]--;
    }
    
    // Copy back to original array
    for (let i = 0; i < n; i++) {
        array[i] = output[i];
        await updateVisualization(array, [i]);
    }
}

// Tim Sort (simplified version)
async function timSort(array) {
    const RUN = 32;
    const n = array.length;
    
    for (let i = 0; i < n; i += RUN) {
        await insertionSort(array, i, Math.min(i + RUN - 1, n - 1));
    }
    
    for (let size = RUN; size < n; size = 2 * size) {
        for (let left = 0; left < n; left += 2 * size) {
            const mid = left + size - 1;
            const right = Math.min(left + 2 * size - 1, n - 1);
            await merge(array, left, mid, right);
        }
    }
} 