// IntersectionObserver isn't available in test environment
// Stub it to all test cases to run when useVisibilty hook is used
export default (jst: any = jest, win: any = window): void => {
  const mockIntersectionObserver = jst.fn();
  mockIntersectionObserver.mockReturnValue({
    observe: () => null,
    unobserve: () => null,
    disconnect: () => null
  });
  win.IntersectionObserver = mockIntersectionObserver;
};
