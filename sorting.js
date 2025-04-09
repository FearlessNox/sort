let array = [];
let visualizationSteps = [];
let animationSpeed = 50;
let isSorting = false;
let startTime = 0;

function updateTimeInfo(status = 'running') {
    const timeInfo = document.getElementById('timeInfo');
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    timeInfo.textContent = status === 'running' 
        ? `Time elapsed: ${elapsedTime}s` 
        : `Sorting ${status}! Total time: ${elapsedTime}s`;
}

function cancelSort() {
    isSorting = false;
    document.getElementById('startBtn').style.display = 'inline-block';
    document.getElementById('cancelBtn').style.display = 'none';
    updateTimeInfo('cancelled');
}

function generateArray(size) {
    array = [];
    const maxNum = parseInt(document.getElementById('maxNumber').value) || 1000;
    for (let i = 0; i < size; i++) {
        array.push(Math.floor(Math.random() * maxNum) + 1);
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

    for (let i = 0; i < n - 1 && isSorting; i++) {
        for (let j = 0; j < n - i - 1 && isSorting; j++) {
            await sleep(animationSpeed);
            updateVisualization(array, [j, j + 1], sorted);
            updateTimeInfo();

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
            }
        }
        sorted.unshift(n - i - 1);
    }
    if (isSorting) {
        sorted.unshift(0);
        updateVisualization(array, [], sorted);
    }
}

async function insertionSort(array) {
    const n = array.length;
    const sorted = [0];

    for (let i = 1; i < n && isSorting; i++) {
        let key = array[i];
        let j = i - 1;

        while (j >= 0 && array[j] > key && isSorting) {
            await sleep(animationSpeed);
            updateVisualization(array, [j, j + 1], sorted);
            updateTimeInfo();
            array[j + 1] = array[j];
            j--;
        }
        array[j + 1] = key;
        sorted.push(i);
        if (isSorting) {
            updateVisualization(array, [], sorted);
        }
    }
}

async function merge(array, start, mid, end) {
    if (!isSorting) return;
    
    let left = array.slice(start, mid + 1);
    let right = array.slice(mid + 1, end + 1);
    let i = 0, j = 0, k = start;
    const sorted = [];

    while (i < left.length && j < right.length && isSorting) {
        await sleep(animationSpeed);
        updateVisualization(array, [start + i, mid + 1 + j], sorted);
        updateTimeInfo();

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
    if (start < end && isSorting) {
        const mid = Math.floor((start + end) / 2);
        await mergeSort(array, start, mid);
        await mergeSort(array, mid + 1, end);
        await merge(array, start, mid, end);
    }
}

async function partition(array, low, high) {
    if (!isSorting) return low;
    
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high && isSorting; j++) {
        await sleep(animationSpeed);
        updateVisualization(array, [j, high]);
        updateTimeInfo();

        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    return i + 1;
}

async function quickSort(array, low = 0, high = array.length - 1) {
    if (low < high && isSorting) {
        const pi = await partition(array, low, high);
        await quickSort(array, low, pi - 1);
        await quickSort(array, pi + 1, high);
    }
}

async function selectionSort(array) {
    const n = array.length;
    const sorted = [];

    for (let i = 0; i < n - 1 && isSorting; i++) {
        let minIdx = i;

        for (let j = i + 1; j < n && isSorting; j++) {
            await sleep(animationSpeed);
            updateVisualization(array, [minIdx, j], sorted);
            updateTimeInfo();

            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
        }

        if (minIdx !== i) {
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
        }
        sorted.push(i);
    }
    if (isSorting) {
        sorted.push(n - 1);
        updateVisualization(array, [], sorted);
    }
}

async function generateAndSort() {
    const size = parseInt(document.getElementById('arraySize').value);
    const maxNum = parseInt(document.getElementById('maxNumber').value);
    const algorithm = document.getElementById('algorithm').value;
    
    if (size < 5 || size > 100) {
        alert('Please enter a size between 5 and 100');
        return;
    }
    if (maxNum < 10 || maxNum > 10000) {
        alert('Please enter a maximum number between 10 and 10000');
        return;
    }

    isSorting = true;
    startTime = Date.now();
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('cancelBtn').style.display = 'inline-block';
    document.getElementById('timeInfo').textContent = 'Starting...';

    array = generateArray(size);
    updateVisualization(array);

    try {
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
        if (isSorting) {
            updateTimeInfo('completed');
        }
    } catch (error) {
        console.error('Sorting error:', error);
    } finally {
        isSorting = false;
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('cancelBtn').style.display = 'none';
    }
}

// Initial visualization
generateAndSort();