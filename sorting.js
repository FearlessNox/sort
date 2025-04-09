let array = [];
let visualizationSteps = [];
let animationSpeed = 50;

function generateArray(size) {
    array = [];
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * 10000) + 1);
    }
    return array;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function updateVisualization(array, comparing = [], sorted = []) {
    const container = document.getElementById('visualization');
    container.innerHTML = '';
    const maxVal = Math.max(...array);
    const width = Math.floor(container.clientWidth / array.length) - 2;

    array.forEach((value, index) => {
        const bar = document.createElement('div');
        bar.className = 'array-bar';
        bar.style.height = `${(value / maxVal) * 350}px`;
        bar.style.width = `${width}px`;

        if (comparing.includes(index)) {
            bar.classList.add('comparing');
        } else if (sorted.includes(index)) {
            bar.classList.add('sorted');
        }

        container.appendChild(bar);
    });
}

async function bubbleSort(array) {
    const n = array.length;
    const sorted = [];

    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            await sleep(animationSpeed);
            updateVisualization(array, [j, j + 1], sorted);

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
            }
        }
        sorted.unshift(n - i - 1);
    }
    sorted.unshift(0);
    updateVisualization(array, [], sorted);
}

async function insertionSort(array) {
    const n = array.length;
    const sorted = [0];

    for (let i = 1; i < n; i++) {
        let key = array[i];
        let j = i - 1;

        while (j >= 0 && array[j] > key) {
            await sleep(animationSpeed);
            updateVisualization(array, [j, j + 1], sorted);
            array[j + 1] = array[j];
            j--;
        }
        array[j + 1] = key;
        sorted.push(i);
        updateVisualization(array, [], sorted);
    }
}

async function merge(array, start, mid, end) {
    let left = array.slice(start, mid + 1);
    let right = array.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;
    const sorted = [];

    while (i < left.length && j < right.length) {
        await sleep(animationSpeed);
        updateVisualization(array, [start + i, mid + 1 + j], sorted);

        if (left[i] <= right[j]) {
            array[k] = left[i];
            i++;
        } else {
            array[k] = right[j];
            j++;
        }
        k++;
    }

    while (i < left.length) {
        await sleep(animationSpeed);
        array[k] = left[i];
        i++;
        k++;
    }

    while (j < right.length) {
        await sleep(animationSpeed);
        array[k] = right[j];
        j++;
        k++;
    }
}

async function mergeSort(array, start = 0, end = array.length - 1) {
    if (start < end) {
        const mid = Math.floor((start + end) / 2);
        await mergeSort(array, start, mid);
        await mergeSort(array, mid + 1, end);
        await merge(array, start, mid, end);
    }
}

async function partition(array, low, high) {
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high; j++) {
        await sleep(animationSpeed);
        updateVisualization(array, [j, high]);

        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    return i + 1;
}

async function quickSort(array, low = 0, high = array.length - 1) {
    if (low < high) {
        const pi = await partition(array, low, high);
        await quickSort(array, low, pi - 1);
        await quickSort(array, pi + 1, high);
    }
}

async function selectionSort(array) {
    const n = array.length;
    const sorted = [];

    for (let i = 0; i < n - 1; i++) {
        let minIdx = i;

        for (let j = i + 1; j < n; j++) {
            await sleep(animationSpeed);
            updateVisualization(array, [minIdx, j], sorted);

            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }

        if (minIdx !== i) {
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
        }
        sorted.push(i);
    }
    sorted.push(n - 1);
    updateVisualization(array, [], sorted);
}

async function generateAndSort() {
    const size = parseInt(document.getElementById('arraySize').value);
    const algorithm = document.getElementById('algorithm').value;
    
    if (size < 5 || size > 100) {
        alert('Please enter a size between 5 and 100');
        return;
    }

    array = generateArray(size);
    updateVisualization(array);

    switch (algorithm) {
        case 'bubble':
            await bubbleSort(array);
            break;
        case 'insertion':
            await insertionSort(array);
            break;
        case 'merge':
            await mergeSort(array);
            break;
        case 'quick':
            await quickSort(array);
            break;
        case 'selection':
            await selectionSort(array);
            break;
    }
}

// Initial visualization
generateAndSort();