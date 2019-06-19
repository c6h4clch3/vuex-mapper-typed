export const keyOf = <O extends {}>(obj: O) => Object.keys(obj) as (keyof O)[];
