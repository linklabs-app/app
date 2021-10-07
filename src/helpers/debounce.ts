export function debounce<T extends (...args: any[]) => any>(fn: Function, delay: number) {
  let timeout

  return () => {
    function caller(...args: Parameters<T>) {
      timeout = null
      fn(...args)
    }

    clearTimeout(timeout)
    timeout = setTimeout(caller, delay)
  };
};