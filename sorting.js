let array = [];
let isSorting = false;
let startTime = 0;
let comparisons = 0;
let swaps = 0;
let animationSpeed = 50;

function updateTimeInfo(status = 'running') {
    const timeInfo = document.getElementById('timeInfo');
    const elapsedTime = ((Date.now() - startTime) / 1000).toFixed(2);
    timeInfo.textContent = status === 'running' 
        ? `Tempo: ${elapsedTime}s` 
        : `Ordenação ${status}! Tempo total: ${elapsedTime}s`;
}

function updateStats() {
    document.getElementById('comparisons').textContent = `Comparações: ${comparisons}`;
    document.getElementById('swaps').textContent = `Trocas: ${swaps}`;
}

function cancelSort() {
    isSorting = false;
    document.getElementById('startBtn').style.display = 'inline-block';
    document.getElementById('cancelBtn').style.display = 'none';
    updateTimeInfo('cancelada');
}

function generateArray(size) {
    array = [];
    const maxNum = parseInt(document.getElementById('maxNumber').value) || 100;
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
    const width = Math.max(2, Math.floor((container.clientWidth - (array.length - 1) * 2) / array.length));

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

// Bogo Sort
async function bogoSort(array) {
    const n = array.length;
    const sorted = [];
    let attempts = 0;
    const maxAttempts = 1000;

    while (!await isSorted(array) && isSorting && attempts < maxAttempts) {
        await shuffleArray(array);
        await sleep(animationSpeed);
        updateVisualization(array, [attempts % n, (attempts + 1) % n]);
        updateTimeInfo();
        attempts++;
        comparisons++;
        updateStats();
    }

    if (isSorting && attempts < maxAttempts) {
        for (let i = 0; i < n; i++) {
            sorted.push(i);
        }
        updateVisualization(array, [], sorted);
    } else if (attempts >= maxAttempts) {
        alert('Bogosort atingiu o limite máximo de tentativas!');
    }
}

async function isSorted(array) {
    for (let i = 0; i < array.length - 1; i++) {
        if (array[i] > array[i + 1]) {
            return false;
        }
    }
    return true;
}

async function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
        swaps++;
    }
}

// Bubble Sort
async function bubbleSort(array) {
    const n = array.length;
    const sorted = [];

    for (let i = 0; i < n - 1 && isSorting; i++) {
        for (let j = 0; j < n - i - 1 && isSorting; j++) {
            await sleep(animationSpeed);
            updateVisualization(array, [j, j + 1], sorted);
            updateTimeInfo();
            comparisons++;

            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                swaps++;
            }
            updateStats();
        }
        sorted.unshift(n - i - 1);
    }
    if (isSorting) {
        sorted.unshift(0);
        updateVisualization(array, [], sorted);
    }
}

// Insertion Sort
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
            comparisons++;
            array[j + 1] = array[j];
            j--;
            swaps++;
            updateStats();
        }
        array[j + 1] = key;
        sorted.push(i);
        if (isSorting) {
            updateVisualization(array, [], sorted);
        }
    }
}

// Merge Sort
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
        comparisons++;

        if (left[i] <= right[j]) {
            array[k] = left[i];
            i++;
        } else {
            array[k] = right[j];
            j++;
        }
        k++;
        swaps++;
        updateStats();
    }

    while (i < left.length) {
        await sleep(animationSpeed);
        array[k] = left[i];
        i++;
        k++;
        swaps++;
        updateStats();
    }

    while (j < right.length) {
        await sleep(animationSpeed);
        array[k] = right[j];
        j++;
        k++;
        swaps++;
        updateStats();
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

// Quick Sort
async function partition(array, low, high) {
    if (!isSorting) return low;
    
    const pivot = array[high];
    let i = low - 1;

    for (let j = low; j < high && isSorting; j++) {
        await sleep(animationSpeed);
        updateVisualization(array, [j, high]);
        updateTimeInfo();
        comparisons++;

        if (array[j] < pivot) {
            i++;
            [array[i], array[j]] = [array[j], array[i]];
            swaps++;
            updateStats();
        }
    }

    [array[i + 1], array[high]] = [array[high], array[i + 1]];
    swaps++;
    updateStats();
    return i + 1;
}

async function quickSort(array, low = 0, high = array.length - 1) {
    if (low < high && isSorting) {
        const pi = await partition(array, low, high);
        await quickSort(array, low, pi - 1);
        await quickSort(array, pi + 1, high);
    }
}

// Selection Sort
async function selectionSort(array) {
    const n = array.length;
    const sorted = [];

    for (let i = 0; i < n - 1 && isSorting; i++) {
        let minIdx = i;

        for (let j = i + 1; j < n && isSorting; j++) {
            await sleep(animationSpeed);
            updateVisualization(array, [minIdx, j], sorted);
            updateTimeInfo();
            comparisons++;

            if (array[j] < array[minIdx]) {
                minIdx = j;
            }
            updateStats();
        }

        if (minIdx !== i) {
            [array[i], array[minIdx]] = [array[minIdx], array[i]];
            swaps++;
            updateStats();
        }
        sorted.push(i);
    }
    if (isSorting) {
        sorted.push(n - 1);
        updateVisualization(array, [], sorted);
    }
}

// Shell Sort
async function shellSort(array) {
    const n = array.length;
    const sorted = [];
    let gap = Math.floor(n/2);

    while (gap > 0 && isSorting) {
        for (let i = gap; i < n && isSorting; i++) {
            let temp = array[i];
            let j = i;

            while (j >= gap && array[j - gap] > temp && isSorting) {
                await sleep(animationSpeed);
                updateVisualization(array, [j, j - gap], sorted);
                updateTimeInfo();
                comparisons++;
                array[j] = array[j - gap];
                j -= gap;
                swaps++;
                updateStats();
            }
            array[j] = temp;
        }
        gap = Math.floor(gap/2);
    }

    if (isSorting) {
        for (let i = 0; i < n; i++) {
            sorted.push(i);
        }
        updateVisualization(array, [], sorted);
    }
}

// Tim Sort
async function binarySearch(array, item, start, end) {
    if (start === end) {
        return item > array[start] ? start + 1 : start;
    }

    const mid = Math.floor((start + end) / 2);

    if (item === array[mid]) {
        return mid + 1;
    }

    if (item > array[mid]) {
        return binarySearch(array, item, mid + 1, end);
    }

    return binarySearch(array, item, start, mid);
}

async function insertionSortForTim(array, left, right) {
    for (let i = left + 1; i <= right && isSorting; i++) {
        const temp = array[i];
        let j = i - 1;
        const pos = await binarySearch(array, temp, left, j);

        while (j >= pos && isSorting) {
            await sleep(animationSpeed);
            updateVisualization(array, [j, j + 1]);
            updateTimeInfo();
            comparisons++;
            array[j + 1] = array[j];
            j--;
            swaps++;
            updateStats();
        }
        array[j + 1] = temp;
    }
}

async function mergeForTim(array, l, m, r) {
    if (!isSorting) return;

    const len1 = m - l + 1;
    const len2 = r - m;
    const left = array.slice(l, m + 1);
    const right = array.slice(m + 1, r + 1);
    let i = 0, j = 0, k = l;

    while (i < len1 && j < len2 && isSorting) {
        await sleep(animationSpeed);
        updateVisualization(array, [l + i, m + 1 + j]);
        updateTimeInfo();
        comparisons++;

        if (left[i] <= right[j]) {
            array[k] = left[i];
            i++;
        } else {
            array[k] = right[j];
            j++;
        }
        k++;
        swaps++;
        updateStats();
    }

    while (i < len1) {
        array[k] = left[i];
        i++;
        k++;
        swaps++;
        updateStats();
    }

    while (j < len2) {
        array[k] = right[j];
        j++;
        k++;
        swaps++;
        updateStats();
    }
}

async function timSort(array) {
    const n = array.length;
    const minRun = 32;
    const sorted = [];

    for (let i = 0; i < n && isSorting; i += minRun) {
        await insertionSortForTim(array, i, Math.min(i + minRun - 1, n - 1));
    }

    for (let size = minRun; size < n && isSorting; size = 2 * size) {
        for (let left = 0; left < n - size && isSorting; left += 2 * size) {
            const mid = left + size - 1;
            const right = Math.min(left + 2 * size - 1, n - 1);
            await mergeForTim(array, left, mid, right);
        }
    }

    if (isSorting) {
        for (let i = 0; i < n; i++) {
            sorted.push(i);
        }
        updateVisualization(array, [], sorted);
    }
}

// Heap Sort
async function heapSort(array) {
    const n = array.length;
    const sorted = [];

    // Construir heap máximo
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        await heapify(array, n, i, sorted);
    }

    // Extrair elementos do heap um por um
    for (let i = n - 1; i > 0; i--) {
        await sleep(animationSpeed);
        [array[0], array[i]] = [array[i], array[0]];
        swaps++;
        updateStats();
        sorted.push(i);
        await updateVisualization(array, [0, i], sorted);
        await heapify(array, i, 0, sorted);
    }
    
    sorted.push(0);
    await updateVisualization(array, [], sorted);
}

async function heapify(array, n, i, sorted) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    await sleep(animationSpeed);
    await updateVisualization(array, [i, left, right], sorted);

    if (left < n && array[left] > array[largest]) {
        largest = left;
    }
    if (right < n && array[right] > array[largest]) {
        largest = right;
    }

    if (largest !== i) {
        [array[i], array[largest]] = [array[largest], array[i]];
        swaps++;
        updateStats();
        await updateVisualization(array, [i, largest], sorted);
        await heapify(array, n, largest, sorted);
    }
}

// Counting Sort
async function countingSort(array) {
    const max = Math.max(...array);
    const count = new Array(max + 1).fill(0);
    const output = new Array(array.length);
    const sorted = [];

    // Contar ocorrências
    for (let i = 0; i < array.length; i++) {
        count[array[i]]++;
        await sleep(animationSpeed);
        await updateVisualization(array, [i], sorted);
    }

    // Acumular contagens
    for (let i = 1; i <= max; i++) {
        count[i] += count[i - 1];
    }

    // Construir array de saída
    for (let i = array.length - 1; i >= 0; i--) {
        const value = array[i];
        const position = count[value] - 1;
        output[position] = value;
        count[value]--;
        
        await sleep(animationSpeed);
        await updateVisualization(array, [i], sorted);
    }

    // Copiar de volta para o array original
    for (let i = 0; i < array.length; i++) {
        array[i] = output[i];
        sorted.push(i);
        await sleep(animationSpeed);
        await updateVisualization(array, [], sorted);
    }
}

// Bucket Sort
async function bucketSort(array) {
    const n = array.length;
    const buckets = Array.from({ length: n }, () => []);
    const max = Math.max(...array);
    const sorted = [];

    // Distribuir elementos nos buckets
    for (let i = 0; i < n; i++) {
        const bucketIndex = Math.floor((array[i] / max) * (n - 1));
        buckets[bucketIndex].push(array[i]);
        await sleep(animationSpeed);
        await updateVisualization(array, [i], sorted);
    }

    // Ordenar cada bucket
    for (let i = 0; i < n; i++) {
        buckets[i].sort((a, b) => a - b);
    }

    // Recolher elementos dos buckets
    let index = 0;
    for (let i = 0; i < n; i++) {
        for (let j = 0; j < buckets[i].length; j++) {
            array[index] = buckets[i][j];
            sorted.push(index);
            await sleep(animationSpeed);
            await updateVisualization(array, [], sorted);
            index++;
        }
    }
}

// Radix Sort
async function radixSort(array) {
    const max = Math.max(...array);
    const sorted = [];

    for (let exp = 1; Math.floor(max / exp) > 0; exp *= 10) {
        await countingSortForRadix(array, exp, sorted);
    }
}

async function countingSortForRadix(array, exp, sorted) {
    const n = array.length;
    const output = new Array(n);
    const count = new Array(10).fill(0);

    // Contar ocorrências de cada dígito
    for (let i = 0; i < n; i++) {
        const digit = Math.floor(array[i] / exp) % 10;
        count[digit]++;
        await sleep(animationSpeed);
        await updateVisualization(array, [i], sorted);
    }

    // Acumular contagens
    for (let i = 1; i < 10; i++) {
        count[i] += count[i - 1];
    }

    // Construir array de saída
    for (let i = n - 1; i >= 0; i--) {
        const digit = Math.floor(array[i] / exp) % 10;
        const position = count[digit] - 1;
        output[position] = array[i];
        count[digit]--;
        
        await sleep(animationSpeed);
        await updateVisualization(array, [i], sorted);
    }

    // Copiar de volta para o array original
    for (let i = 0; i < n; i++) {
        array[i] = output[i];
        sorted.push(i);
        await sleep(animationSpeed);
        await updateVisualization(array, [], sorted);
    }
}

async function generateAndSort() {
    const size = parseInt(document.getElementById('arraySize').value);
    const maxNum = parseInt(document.getElementById('maxNumber').value);
    const algorithm = document.getElementById('algorithm').value;
    const speed = parseInt(document.getElementById('speed').value);
    
    if (size < 5 || size > 100) {
        alert('Por favor, insira um tamanho entre 5 e 100');
        return;
    }
    if (maxNum < 10 || maxNum > 1000) {
        alert('Por favor, insira um número máximo entre 10 e 1000');
        return;
    }

    isSorting = true;
    startTime = Date.now();
    comparisons = 0;
    swaps = 0;
    animationSpeed = 101 - speed; // Inverte a escala para que maior valor = mais rápido
    document.getElementById('startBtn').style.display = 'none';
    document.getElementById('cancelBtn').style.display = 'inline-block';
    document.getElementById('timeInfo').textContent = 'Iniciando...';

    array = generateArray(size);
    updateVisualization(array);

    try {
        switch (algorithm) {
            case 'bogo':
                await bogoSort(array);
                break;
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
            case 'shell':
                await shellSort(array);
                break;
            case 'tim':
                await timSort(array);
                break;
            case 'heap':
                await heapSort(array);
                break;
            case 'counting':
                await countingSort(array);
                break;
            case 'bucket':
                await bucketSort(array);
                break;
            case 'radix':
                await radixSort(array);
                break;
            default:
                await bogoSort(array);
        }
        if (isSorting) {
            updateTimeInfo('concluída');
        }
    } catch (error) {
        console.error('Erro na ordenação:', error);
    } finally {
        isSorting = false;
        document.getElementById('startBtn').style.display = 'inline-block';
        document.getElementById('cancelBtn').style.display = 'none';
    }
}

// Inicialização
generateAndSort(); 