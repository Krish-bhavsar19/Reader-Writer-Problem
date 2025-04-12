let readerCount = [0, 0];
let writerQueue = [[], []];
let writerActive = [false, false];
let activeWriterId = [0, 0];
let readerQueue = [[], []];
let readerId = [1, 1];
let writerId = [1, 1];
let activeReaders = [[], []];

function updateCounters() {
    for (let i = 1; i <= 2; i++) {
        document.getElementById("readerCount" + i).innerText = "Readers: " + readerCount[i - 1];
        document.getElementById("writerActive" + i).innerText = writerActive[i - 1]
            ? "Writer: " + activeWriterId[i - 1]
            : "Writer: None";
    }
}

function logMessage(type, id, message, problem) {
    let log = document.getElementById("log" + problem);
    let entry = document.createElement("div");
    let timestamp = new Date().toLocaleTimeString();
    entry.className = type;
    entry.innerText = `[${timestamp}] ${type === 'reader' ? 'Reader' : 'Writer'} ${id}: ${message}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;
}

function addReader(problem) {
    let index = problem - 1;
    let id = readerId[index]++;

    if (!writerActive[index] && (problem === 1 || writerQueue[index].length === 0)) {
        readerCount[index]++;
        activeReaders[index].push(id);
        logMessage('reader', id, 'Started reading', problem);
        updateCounters();
    } else {
        readerQueue[index].push(id);
        logMessage('reader', id, 'Waiting to read', problem);
    }

    process(problem);
}

function addWriter(problem) {
    let index = problem - 1;
    let id = writerId[index]++;

    if (!writerActive[index] && readerCount[index] === 0) {
        writerActive[index] = true;
        activeWriterId[index] = id;
        logMessage('writer', id, 'Started writing', problem);
        updateCounters();
    } else {
        writerQueue[index].push(id);
        logMessage('writer', id, 'Waiting to write', problem);
    }

    process(problem);
}

function finishReader(problem) {
    let index = problem - 1;
    if (readerCount[index] > 0) {
        readerCount[index]--;
        let finishedReader = activeReaders[index].shift() || '-';
        logMessage('reader', finishedReader, 'Finished reading', problem);
        updateCounters();
        process(problem);
    }
}

function finishWriter(problem) {
    let index = problem - 1;
    if (writerActive[index]) {
        writerActive[index] = false;
        activeWriterId[index] = 0;
        logMessage('writer', '-', 'Finished writing', problem);
        updateCounters();
        process(problem);
    }
}

function process(problem) {
    let index = problem - 1;
    if (writerActive[index]) return;

    switch (problem) {
        case 1:
            if (readerQueue[index].length > 0) {
                while (readerQueue[index].length > 0) {
                    let reader = readerQueue[index].shift();
                    readerCount[index]++;
                    activeReaders[index].push(reader);
                    logMessage('reader', reader, 'Started reading', problem);
                }
                updateCounters();
            } else if (writerQueue[index].length > 0 && readerCount[index] === 0) {
                let writer = writerQueue[index].shift();
                writerActive[index] = true;
                activeWriterId[index] = writer;
                logMessage('writer', writer, 'Started writing', problem);
                updateCounters();
            }
            break;

        case 2:
            if (writerQueue[index].length > 0 && readerCount[index] === 0) {
                let writer = writerQueue[index].shift();
                writerActive[index] = true;
                activeWriterId[index] = writer;
                logMessage('writer', writer, 'Started writing', problem);
                updateCounters();
            } else if (readerQueue[index].length > 0 && writerQueue[index].length === 0) {
                while (readerQueue[index].length > 0) {
                    let reader = readerQueue[index].shift();
                    readerCount[index]++;
                    activeReaders[index].push(reader);
                    logMessage('reader', reader, 'Started reading', problem);
                }
                updateCounters();
            }
            break;
    }
}