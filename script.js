document.addEventListener('DOMContentLoaded', () => {
    let currentArray = [];
    const MAX_ARRAY_SIZE_DISPLAY = 30;
    const ANIMATION_DELAY_MS = 120;

    // DOM Elements
    const arrayInputEl = document.getElementById('arrayInput');
    const btnCreateArray = document.getElementById('btnCreateArray');
    const btnRandomArray = document.getElementById('btnRandomArray');
    const currentArrayDisplayEl = document.getElementById('currentArrayDisplay');
    const arrayVisualizationEl = document.getElementById('arrayVisualization');

    const searchValueEl = document.getElementById('searchValue');
    const btnLinearSearch = document.getElementById('btnLinearSearch');
    const btnBinarySearch = document.getElementById('btnBinarySearch');
    const searchResultTxtEl = document.getElementById('searchResultTxt');

    const btnFindMax = document.getElementById('btnFindMax');
    const maxResultTxtEl = document.getElementById('maxResultTxt');
    const btnFindMin = document.getElementById('btnFindMin');
    const minResultTxtEl = document.getElementById('minResultTxt');
    const btnSumArray = document.getElementById('btnSumArray');
    const sumResultTxtEl = document.getElementById('sumResultTxt');

    const insertValueEl = document.getElementById('insertValue');
    const insertPositionEl = document.getElementById('insertPosition');
    const btnInsertElement = document.getElementById('btnInsertElement');

    const deletePositionEl = document.getElementById('deletePosition');
    const btnDeleteByPosition = document.getElementById('btnDeleteByPosition');
    const deleteValueEl = document.getElementById('deleteValue');
    const btnDeleteByValue = document.getElementById('btnDeleteByValue');

    const sortAlgorithmSelectEl = document.getElementById('sortAlgorithmSelect');
    const btnSortArray = document.getElementById('btnSortArray');
    const messageAreaEl = document.getElementById('messageArea');

    // --- Helper Functions ---
    function displayMessage(text, type = 'info') {
        messageAreaEl.textContent = text;
        messageAreaEl.className = '';
        messageAreaEl.classList.add(type);

        if (text) {
            setTimeout(() => {
                messageAreaEl.textContent = '';
                messageAreaEl.className = '';
            }, 4000);
        }
    }

    function renderVisualization() {
        arrayVisualizationEl.innerHTML = '';
        if (currentArray.length === 0 || currentArray.length > MAX_ARRAY_SIZE_DISPLAY) {
            if (currentArray.length > MAX_ARRAY_SIZE_DISPLAY) {
                arrayVisualizationEl.style.display = 'flex';
                arrayVisualizationEl.innerHTML = '<p style="margin:auto; color: var(--secondary-color); font-style:italic;">Mảng quá lớn để trực quan hóa chi tiết.</p>';
            } else {
                arrayVisualizationEl.style.display = 'none';
            }
            return;
        }
        arrayVisualizationEl.style.display = 'flex';

        const allValues = [...currentArray, 0];
        const maxValue = Math.max(...allValues);
        const minValue = Math.min(...allValues);

        let range = maxValue - minValue;
        if (range === 0) {
            range = Math.abs(maxValue) > 0 ? Math.abs(maxValue) : 1;
        }

        const containerHeight = arrayVisualizationEl.clientHeight - 10;

        currentArray.forEach((value, index) => {
            const bar = document.createElement('div');
            bar.classList.add('bar');
            bar.textContent = value;

            let barHeightPercent = 0;
            if (range !== 0) {
                let scaledValue = (value - minValue) / range;
                barHeightPercent = scaledValue * 80 + 10;
            } else {
                barHeightPercent = 50;
            }
            bar.style.height = `${Math.max(10, (containerHeight * barHeightPercent) / 100)}px`;
            bar.dataset.index = index;
            arrayVisualizationEl.appendChild(bar);
        });
    }

    function updateArrayDisplay() {
        if (currentArray.length === 0) {
            currentArrayDisplayEl.textContent = "[Mảng rỗng]";
        } else {
            currentArrayDisplayEl.textContent = `[ ${currentArray.join(', ')} ]`;
        }
        renderVisualization();
        searchResultTxtEl.textContent = '-';
        searchResultTxtEl.classList.remove('not-found');
        maxResultTxtEl.textContent = '-';
        minResultTxtEl.textContent = '-';
        sumResultTxtEl.textContent = '-';
    }

    function parseInputToArray(inputString) {
        if (!inputString.trim()) return [];
        return inputString.split(/[\s,]+/)
            .map(item => parseInt(item.trim()))
            .filter(item => !isNaN(item));
    }

    // --- Event Listeners ---
    btnCreateArray.addEventListener('click', () => {
        const inputText = arrayInputEl.value;
        currentArray = parseInputToArray(inputText);
        updateArrayDisplay();
        displayMessage(currentArray.length > 0 ? "Mảng đã được tạo/cập nhật thành công." : "Đã xóa mảng (input rỗng).", "success");
    });

    btnRandomArray.addEventListener('click', () => {
        const size = Math.floor(Math.random() * 10) + 5;
        currentArray = [];
        for (let i = 0; i < size; i++) {
            currentArray.push(Math.floor(Math.random() * 201) - 100);
        }
        arrayInputEl.value = currentArray.join(', ');
        updateArrayDisplay();
        displayMessage(`Đã tạo mảng ngẫu nhiên gồm ${size} phần tử.`, "success");
    });

    // --- Array Operations Logic (Tìm kiếm, Thông tin mảng, Chèn, Xóa) ---
    btnFindMax.addEventListener('click', () => {
        if (currentArray.length === 0) {
            maxResultTxtEl.textContent = "Mảng rỗng";
            displayMessage("Mảng hiện tại rỗng, không thể tìm Max.", "info");
            return;
        }
        maxResultTxtEl.textContent = Math.max(...currentArray);
    });

    btnFindMin.addEventListener('click', () => {
        if (currentArray.length === 0) {
            minResultTxtEl.textContent = "Mảng rỗng";
            displayMessage("Mảng hiện tại rỗng, không thể tìm Min.", "info");
            return;
        }
        minResultTxtEl.textContent = Math.min(...currentArray);
    });

    btnSumArray.addEventListener('click', () => {
        if (currentArray.length === 0) {
            sumResultTxtEl.textContent = "Mảng rỗng";
            displayMessage("Mảng hiện tại rỗng, không thể tính tổng.", "info");
            return;
        }
        const sum = currentArray.reduce((acc, val) => acc + val, 0);
        sumResultTxtEl.textContent = sum;
    });

    btnLinearSearch.addEventListener('click', async () => {
        if (currentArray.length === 0) {
            searchResultTxtEl.textContent = "Mảng rỗng";
            displayMessage("Mảng rỗng, không thể thực hiện tìm kiếm.", "info");
            return;
        }
        const value = parseInt(searchValueEl.value);
        if (isNaN(value)) {
            searchResultTxtEl.textContent = "Vui lòng nhập số hợp lệ.";
            searchResultTxtEl.classList.add('not-found');
            displayMessage("Giá trị tìm kiếm không phải là số hợp lệ.", "error");
            return;
        }

        let foundIndices = [];
        for (let i = 0; i < currentArray.length; i++) {
            if (currentArray[i] === value) {
                foundIndices.push(i);
            }
        }

        if (foundIndices.length > 0) {
            searchResultTxtEl.textContent = `Tìm thấy tại vị trí (0-based): ${foundIndices.join(', ')}`;
            searchResultTxtEl.classList.remove('not-found');
            displayMessage(`Đã tìm thấy giá trị ${value}.`, "success");
        } else {
            searchResultTxtEl.textContent = "Không tìm thấy giá trị.";
            searchResultTxtEl.classList.add('not-found');
            displayMessage(`Không tìm thấy giá trị ${value} trong mảng.`, "info");
        }
    });

    btnBinarySearch.addEventListener('click', async () => {
        if (currentArray.length === 0) {
            searchResultTxtEl.textContent = "Mảng rỗng";
            displayMessage("Mảng rỗng, không thể thực hiện tìm kiếm.", "info");
            return;
        }
        const value = parseInt(searchValueEl.value);
        if (isNaN(value)) {
            searchResultTxtEl.textContent = "Vui lòng nhập số hợp lệ.";
            searchResultTxtEl.classList.add('not-found');
            displayMessage("Giá trị tìm kiếm không phải là số hợp lệ.", "error");
            return;
        }

        let sorted = true;
        for (let i = 0; i < currentArray.length - 1; i++) {
            if (currentArray[i] > currentArray[i + 1]) {
                sorted = false;
                break;
            }
        }
        if (!sorted) {
            searchResultTxtEl.textContent = "Lỗi: Mảng chưa được sắp xếp.";
            searchResultTxtEl.classList.add('not-found');
            displayMessage("Mảng cần được sắp xếp tăng dần trước khi thực hiện tìm kiếm nhị phân!", "error");
            return;
        }

        let low = 0, high = currentArray.length - 1, foundIndex = -1;
        while (low <= high) {
            let mid = Math.floor((low + high) / 2);

            if (currentArray[mid] === value) {
                foundIndex = mid;
                break;
            } else if (currentArray[mid] < value) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        if (foundIndex !== -1) {
            searchResultTxtEl.textContent = `Tìm thấy tại vị trí (0-based): ${foundIndex}`;
            searchResultTxtEl.classList.remove('not-found');
            displayMessage(`Đã tìm thấy giá trị ${value}.`, "success");
        } else {
            searchResultTxtEl.textContent = "Không tìm thấy giá trị.";
            searchResultTxtEl.classList.add('not-found');
            displayMessage(`Không tìm thấy giá trị ${value} trong mảng.`, "info");
        }
    });

    btnInsertElement.addEventListener('click', () => {
        const val = parseInt(insertValueEl.value);
        const pos = parseInt(insertPositionEl.value);

        if (isNaN(val)) {
            displayMessage("Giá trị cần chèn không hợp lệ.", "error"); return;
        }
        if (isNaN(pos) || pos < 0 || pos > currentArray.length) {
            displayMessage(`Vị trí chèn không hợp lệ (phải từ 0 đến ${currentArray.length}).`, "error"); return;
        }
        currentArray.splice(pos, 0, val);
        updateArrayDisplay();
        arrayInputEl.value = currentArray.join(', ');
        displayMessage(`Đã chèn giá trị ${val} vào vị trí ${pos}.`, "success");
        insertValueEl.value = '';
        insertPositionEl.value = '';
    });

    btnDeleteByPosition.addEventListener('click', () => {
        const pos = parseInt(deletePositionEl.value);
        if (currentArray.length === 0) {
            displayMessage("Mảng rỗng, không thể xóa.", "info"); return;
        }
        if (isNaN(pos) || pos < 0 || pos >= currentArray.length) {
            displayMessage(`Vị trí xóa không hợp lệ (phải từ 0 đến ${currentArray.length - 1}).`, "error"); return;
        }
        const deletedValue = currentArray.splice(pos, 1);
        updateArrayDisplay();
        arrayInputEl.value = currentArray.join(', ');
        displayMessage(`Đã xóa phần tử ${deletedValue[0]} tại vị trí ${pos}.`, "success");
        deletePositionEl.value = '';
    });

    btnDeleteByValue.addEventListener('click', () => {
        if (currentArray.length === 0) {
            displayMessage("Mảng rỗng, không thể xóa.", "info"); return;
        }
        const val = parseInt(deleteValueEl.value);
        if (isNaN(val)) {
            displayMessage("Giá trị cần xóa không hợp lệ.", "error"); return;
        }
        const index = currentArray.indexOf(val);
        if (index !== -1) {
            currentArray.splice(index, 1);
            updateArrayDisplay();
            arrayInputEl.value = currentArray.join(', ');
            displayMessage(`Đã xóa phần tử ${val} đầu tiên tìm thấy trong mảng.`, "success");
        } else {
            displayMessage(`Không tìm thấy giá trị ${val} để xóa trong mảng.`, "info");
        }
        deleteValueEl.value = '';
    });

    btnSortArray.addEventListener('click', async () => {
        if (currentArray.length === 0) {
            displayMessage("Mảng rỗng, không có gì để sắp xếp.", "info");
            return;
        }
        document.querySelectorAll('button, input, select').forEach(el => el.disabled = true);

        const algo = sortAlgorithmSelectEl.value;
        try {
            switch (algo) {
                case 'bubbleSort':
                    bubbleSortLogic(currentArray);
                    break;
                case 'selectionSort':
                    selectionSortLogic(currentArray);
                    break;
                case 'insertionSort':
                    insertionSortLogic(currentArray);
                    break;
                case 'quickSort':
                    quickSortLogic(currentArray, 0, currentArray.length - 1);
                    break;
                case 'mergeSort':
                    performMergeSort(tempArray);
                    break;
            }
            updateArrayDisplay();
            arrayInputEl.value = currentArray.join(', ');
            displayMessage(`Mảng đã được sắp xếp thành công bằng ${algo}.`, "success");
        } catch (e) {
            console.error("Lỗi khi sắp xếp:", e);
            displayMessage("Đã có lỗi xảy ra trong quá trình sắp xếp.", "error");
        } finally {
            document.querySelectorAll('button, input, select').forEach(el => el.disabled = false);
        }
    });

    // --- Sorting Algorithms (Logic only, no visualization steps) ---
    function bubbleSortLogic(arr) { // Sắp xếp nổi bọt
        let n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (arr[j] > arr[j + 1]) {
                    [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
                }
            }
        }
    }

    function selectionSortLogic(arr) { // Sắp xếp chọn
        let n = arr.length;
        for (let i = 0; i < n - 1; i++) {
            let minIdx = i;
            for (let j = i + 1; j < n; j++) {
                if (arr[j] < arr[minIdx]) {
                    minIdx = j;
                }
            }
            if (minIdx !== i) {
                [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
            }
        }
    }

    function insertionSortLogic(arr) { // Sắp xếp chèn
        let n = arr.length;
        for (let i = 1; i < n; i++) {
            let key = arr[i];
            let j = i - 1;
            while (j >= 0 && arr[j] > key) {
                arr[j + 1] = arr[j];
                j = j - 1;
            }
            arr[j + 1] = key;
        }
    }

    function quickSortLogic(arr, low, high) { // Sắp xếp nhanh
        if (low < high) {
            let pi = partitionLogic(arr, low, high);
            quickSortLogic(arr, low, pi - 1);
            quickSortLogic(arr, pi + 1, high);
        }
    }

    function partitionLogic(arr, low, high) {
        let pivot = arr[high];
        let i = low - 1;
        for (let j = low; j < high; j++) {
            if (arr[j] < pivot) {
                i++;
                [arr[i], arr[j]] = [arr[j], arr[i]];
            }
        }
        [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
        return i + 1;
    }

    function performMergeSort(arr) { // Sắp xếp trộn
        const sortedArray = mergeSortRecursive(arr);
        for (let i = 0; i < arr.length; i++) {
            arr[i] = sortedArray[i];
        }
    }

    function mergeSortRecursive(arr) {
        const n = arr.length;
        if (n <= 1) {
            return arr;
        }

        const mid = Math.floor(n / 2);
        const leftHalf = arr.slice(0, mid);
        const rightHalf = arr.slice(mid);

        const sortedLeft = mergeSortRecursive(leftHalf);
        const sortedRight = mergeSortRecursive(rightHalf);

        return merge(sortedLeft, sortedRight);
    }

    function merge(leftArr, rightArr) {
        const result = [];
        let leftIndex = 0;
        let rightIndex = 0;

        while (leftIndex < leftArr.length && rightIndex < rightArr.length) {
            if (leftArr[leftIndex] < rightArr[rightIndex]) {
                result.push(leftArr[leftIndex]);
                leftIndex++;
            } else {
                result.push(rightArr[rightIndex]);
                rightIndex++;
            }
        }

        while (leftIndex < leftArr.length) {
            result.push(leftArr[leftIndex]);
            leftIndex++;
        }

        while (rightIndex < rightArr.length) {
            result.push(rightArr[rightIndex]);
            rightIndex++;
        }
        return result;
    }
    // --- Initial Call ---
    updateArrayDisplay();
    window.addEventListener('resize', renderVisualization);
});
