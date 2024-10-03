export type DependenciesCallback<T extends object> = (
  event: T
) => Array<boolean>

export type ClearEvent<T extends object> = (event: T) => void
