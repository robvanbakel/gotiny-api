export default (code: string, message: string) => ({
  error: {
    source: 'api',
    code,
    message,
  },
});
