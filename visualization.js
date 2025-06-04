// Algorithm information
const algorithmInfo = {
    bogo: {
        name: "Bogo Sort",
        description: "A highly inefficient sorting algorithm that randomly shuffles the array until it's sorted. It's mainly used for educational purposes to demonstrate what not to do.",
        timeComplexity: "O((n+1)!)",
        spaceComplexity: "O(1)"
    },
    bubble: {
        name: "Bubble Sort",
        description: "A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)"
    },
    insertion: {
        name: "Insertion Sort",
        description: "Builds the final sorted array one item at a time. It's much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)"
    },
    merge: {
        name: "Merge Sort",
        description: "A divide-and-conquer algorithm that recursively breaks down the array into smaller subarrays until each has only one element, then merges them back together in sorted order.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)"
    },
    quick: {
        name: "Quick Sort",
        description: "A divide-and-conquer algorithm that picks an element as pivot and partitions the array around the pivot.",
        timeComplexity: "O(n log n) average, O(n²) worst",
        spaceComplexity: "O(log n)"
    },
    selection: {
        name: "Selection Sort",
        description: "Divides the input into a sorted and unsorted region, and iteratively shrinks the unsorted region by extracting the smallest element and moving it to the sorted region.",
        timeComplexity: "O(n²)",
        spaceComplexity: "O(1)"
    },
    shell: {
        name: "Shell Sort",
        description: "An optimization of insertion sort that allows the exchange of items that are far apart. The idea is to arrange the list of elements so that, starting anywhere, taking every hth element produces a sorted list.",
        timeComplexity: "O(n log² n)",
        spaceComplexity: "O(1)"
    },
    tim: {
        name: "Tim Sort",
        description: "A hybrid sorting algorithm derived from merge sort and insertion sort, designed to perform well on many kinds of real-world data.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(n)"
    },
    heap: {
        name: "Heap Sort",
        description: "A comparison-based sorting algorithm that uses a binary heap data structure. It divides its input into a sorted and an unsorted region, and iteratively shrinks the unsorted region by extracting the largest element.",
        timeComplexity: "O(n log n)",
        spaceComplexity: "O(1)"
    },
    counting: {
        name: "Counting Sort",
        description: "A sorting algorithm that works by counting the occurrences of each unique element in the array. It's efficient when the range of input data is not significantly greater than the number of objects to be sorted.",
        timeComplexity: "O(n + k)",
        spaceComplexity: "O(k)"
    },
    bucket: {
        name: "Bucket Sort",
        description: "A distribution sort that works by distributing the elements of an array into a number of buckets. Each bucket is then sorted individually, either using a different sorting algorithm or by recursively applying the bucket sorting algorithm.",
        timeComplexity: "O(n + n²/k)",
        spaceComplexity: "O(n + k)"
    },
    radix: {
        name: "Radix Sort",
        description: "A non-comparative sorting algorithm that sorts data with integer keys by grouping keys by the individual digits which share the same significant position and value.",
        timeComplexity: "O(d(n + k))",
        spaceComplexity: "O(n + k)"
    }
};

// DOM Elements
const algorithmSelect = document.getElementById('algorithm-select');
const arraySizeInput = document.getElementById('array-size');
const sizeValue = document.getElementById('size-value');
const generateArrayBtn = document.getElementById('generate-array');
const startSortBtn = document.getElementById('start-sort');
const algorithmDescription = document.getElementById('algorithm-description');
const timeComplexity = document.getElementById('time-complexity');
const spaceComplexity = document.getElementById('space-complexity');
const stopSortBtn = document.getElementById('stop-sort');

let array = [];
let isSorting = false;
let shouldStop = false;
let arrayChanges = 0;
let startTime = 0;
let timeUpdateInterval;

// Map algorithm names to their functions
const sortingAlgorithms = {
    bogo: bogoSort,
    bubble: bubbleSort,
    insertion: insertionSort,
    merge: mergeSort,
    quick: quickSort,
    selection: selectionSort,
    shell: shellSort,
    tim: timSort,
    heap: heapSort,
    counting: countingSort,
    bucket: bucketSort,
    radix: radixSort
};

// Update array size display
arraySizeInput.addEventListener('input', () => {
    sizeValue.textContent = arraySizeInput.value;
});

// Generate new array
generateArrayBtn.addEventListener('click', () => {
    if (isSorting) return;
    array = generateRandomArray(parseInt(arraySizeInput.value));
    updateVisualization(array);
    resetStats();
});

function updateTimeDisplay() {
    const currentTime = performance.now();
    const elapsedTime = Math.round(currentTime - startTime);
    document.getElementById('time-taken').textContent = elapsedTime;
}

// Start sorting
startSortBtn.addEventListener('click', async () => {
    if (isSorting) return;
    
    const selectedAlgorithm = algorithmSelect.value;
    isSorting = true;
    shouldStop = false;
    startTime = performance.now();
    arrayChanges = 0;
    
    // Start time update interval
    timeUpdateInterval = setInterval(updateTimeDisplay, 50);
    
    startSortBtn.disabled = true;
    generateArrayBtn.disabled = true;
    stopSortBtn.disabled = false;
    
    try {
        await sortingAlgorithms[selectedAlgorithm](array);
        if (!shouldStop) {
            const endTime = performance.now();
            document.getElementById('time-taken').textContent = Math.round(endTime - startTime);
            document.getElementById('array-changes').textContent = arrayChanges;
        }
    } catch (error) {
        console.error('Sorting error:', error);
    } finally {
        clearInterval(timeUpdateInterval);
        isSorting = false;
        startSortBtn.disabled = false;
        generateArrayBtn.disabled = false;
        stopSortBtn.disabled = true;
        shouldStop = false;
    }
});

// Stop sorting
stopSortBtn.addEventListener('click', () => {
    shouldStop = true;
    isSorting = false;
    clearInterval(timeUpdateInterval);
    startSortBtn.disabled = false;
    generateArrayBtn.disabled = false;
    stopSortBtn.disabled = true;
    
    // Update final stats
    const endTime = performance.now();
    document.getElementById('time-taken').textContent = Math.round(endTime - startTime);
    document.getElementById('array-changes').textContent = arrayChanges;
});

function resetStats() {
    document.getElementById('time-taken').textContent = '0';
    document.getElementById('array-changes').textContent = '0';
    if (timeUpdateInterval) {
        clearInterval(timeUpdateInterval);
    }
}

// Update algorithm information
algorithmSelect.addEventListener('change', () => {
    const selectedAlgorithm = algorithmSelect.value;
    const info = algorithmInfo[selectedAlgorithm];
    
    algorithmDescription.textContent = info.description;
    timeComplexity.textContent = info.timeComplexity;
    spaceComplexity.textContent = info.spaceComplexity;
    resetStats();
});

// Initialize
window.addEventListener('load', () => {
    array = generateRandomArray(parseInt(arraySizeInput.value));
    updateVisualization(array);
    algorithmSelect.dispatchEvent(new Event('change'));
}); 