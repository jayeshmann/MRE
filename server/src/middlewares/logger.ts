/* eslint-disable @typescript-eslint/no-explicit-any */
const info = (...params: any[]): void => {
  console.log(...params);
};

const error = (...params: any[]): void => {
  console.error(...params);
};

export default { info, error };
