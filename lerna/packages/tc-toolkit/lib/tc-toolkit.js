export const wait = (cb) => {
  return () => {
    return new Promise((resolve, reject) => {
      if (typeof cb !== 'function') {
        return reject()
      }
      const check = () => {
        if (cb()) {
          resolve()
        } else {
          requestAnimationFrame(check)
        }
      }
      check()
    })
  }
}

export const waitForEvents = (eventSetters, callback) => {
  const flags = Array(eventSetters.length).fill(false)
  const results = Array(eventSetters.length)
  const check = () => {
    if (!flags.every(Boolean)) return

    callback(results)
    eventSetters.forEach(({ once }, index) => {
      flags[index] = !!once
    })
  }
  eventSetters.forEach(({ condition: setter, once }, idx) => {
    setter((...args) => {
      flags[idx] = true
      results[idx] = args // 始终为数组
      check()
    })
  })

  const reset = () => {
    flags.fill(false)
  }

  return {
    reset
  }
}

export const makeLimitedFunction = () => {
  let queue = [];
  let isBlocked = false;
  let blockResolver = null;
  let releaseTimer = null;

  // 重置自动释放计时器（3 秒无任务则自动 release）
  const resetAutoRelease = () => {
    clearTimeout(releaseTimer);
    releaseTimer = setTimeout(() => {
      release();
    }, 3000);
  };

  const executeTask = async (task) => {
    try {
      await task();
    } catch (err) {
      console.error('makeLimitedFunction error:', err);
      release()
    }
  };

  const processQueue = async () => {
    if (isBlocked || queue.length === 0) return;

    const task = queue.pop(); // 只保留队尾最新任务
    queue = []; // 丢弃旧任务
    isBlocked = true;

    await executeTask(task);
    isBlocked = false;

    if (queue.length > 0) {
      await processQueue();
    }
  };

  const addTask = (fn) => {
    resetAutoRelease();
    queue = [fn]; // 丢弃旧任务，保留最新的
    if (!isBlocked) {
      processQueue();
    }
  };

  const block = () => {
    return new Promise((resolve) => {
      isBlocked = true;
      blockResolver = resolve;
      resetAutoRelease()
    });
  };

  const release = () => {
    isBlocked = false;
    if (blockResolver) {
      blockResolver();
      blockResolver = null;
    }
    if (queue.length > 0) {
      processQueue();
    }
  };

  return {
    addTask,
    block,
    release,
  };
};
