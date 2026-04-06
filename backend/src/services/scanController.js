const controllers = new Map();

export function createController(scanId) {
  let resolvePause;
  const ctrl = {
    stopped: false,
    paused: false,
    _pausePromise: null,
    runIds: new Set(),

    async waitIfPaused() {
      while (this.paused && !this.stopped) {
        await this._pausePromise;
      }
    },

    pause() {
      if (!this.paused && !this.stopped) {
        this.paused = true;
        this._pausePromise = new Promise((r) => {
          resolvePause = r;
        });
      }
    },

    resume() {
      if (this.paused) {
        this.paused = false;
        this._pausePromise = null;
        const resolve = resolvePause;
        resolvePause = null;
        resolve?.();
      }
    },

    stop() {
      this.stopped = true;
      this.resume();
    },
  };

  controllers.set(scanId, ctrl);
  return ctrl;
}

export function getController(scanId) {
  return controllers.get(scanId) ?? null;
}

export function removeController(scanId) {
  controllers.delete(scanId);
}
