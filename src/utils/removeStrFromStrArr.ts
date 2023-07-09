export default function removeStrFromStrArr(initArr: string[], elemToRemove: string) {
  const result: string[] = [];
  for (const elem of initArr) {
    if (elem !== elemToRemove) result.push(elem); 
  }
  return result;
}
