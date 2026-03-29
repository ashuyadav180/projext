/**
 * io-singleton.js — AutoReel.ai
 * Breaks the circular import cycle between index.js ↔ job.engine.js.
 * index.js sets the io instance here once on startup.
 * job.engine.js and scheduler.service.js call getIO() to emit events.
 */

let _io = null;

export const setIO = (io) => { _io = io; };

export const getIO = () => {
    if (!_io) {
        // Return a no-op object if socket not yet initialized (e.g. during boot)
        return { emit: () => { } };
    }
    return _io;
};
