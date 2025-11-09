// Minimal entry to satisfy tsconfig include and allow typechecking/build
export function hello(name: string): string {
  return `Hello, ${name}`;
}

// Prevent an entirely empty module in some toolchains
export const __ok = true;
