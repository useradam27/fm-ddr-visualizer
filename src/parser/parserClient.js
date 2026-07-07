//wrap parcser worker behind Promise based API

export function parseFile(xmlText, onProgress) {
    return new Promise((resolve, reject) => {
        //create new worker instance
        const worker = new Worker(new URL('../parser/parser.worker.js', import.meta.url),
            { type: 'module' }
        )


        worker.onmessage = (e) => {
            const { type, percent, stage, message, data } = e.data;

            if (type === 'progress') {
                onProgress?.(percent, stage)
            } else if (type === 'complete') {
                //terminate when done
                worker.terminate();
                resolve(data);
            } else if (type === 'error') {
                worker.terminate();
                reject(new Error(message));
            }
        }

        worker.onerror = (err) => {
            worker.terminate();
            reject(new Error(err.message || 'Worker error occurred'));
        }

        //kick off parse
        worker.postMessage({ type: 'parse', xmlText });
    });
}