export const getRandomColorByString = (input: string) => {
  let hash = 0;
  if(!input) return "hsl(0, 70%, 55%)";
  for (let i = 0; i < input.length; i++) {
    hash = input.charCodeAt(i) + ((hash << 5) - hash);
  }
  return `hsl(${hash % 360}, 70%, 55%)`;
};
