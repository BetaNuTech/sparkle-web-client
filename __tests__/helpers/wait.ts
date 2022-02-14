// Promise for given timeout
export default function wait(timeout = 100): Promise<void> {
  return new Promise((r) => setTimeout(r, timeout));
}
