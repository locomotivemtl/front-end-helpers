/**
 * Wraps a wait in a promise that settles on `done`, `fail` or abort.
 * The cleanup returned by `setup` runs once, whichever happens first.
 */
export function abortable(signal, setup) {
    return new Promise((resolve, reject) => {
        if (signal.aborted) {
            reject(signal.reason);
            return;
        }
        let settled = false;
        let cleanup;
        const settle = (finish) => {
            if (settled)
                return;
            settled = true;
            signal.removeEventListener('abort', onAbort);
            cleanup?.();
            finish();
        };
        const onAbort = () => settle(() => reject(signal.reason));
        signal.addEventListener('abort', onAbort, { once: true });
        try {
            cleanup = setup(() => settle(resolve), (error) => settle(() => reject(error)));
        }
        catch (error) {
            settle(() => reject(error));
            return;
        }
        // The wait settled inside setup, before there was a cleanup to run.
        if (settled)
            cleanup();
    });
}
