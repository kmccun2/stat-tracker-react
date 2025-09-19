export const handleInfinityScroll = (container: any, sliceValue: number, setSliceValue: any) => {
  let height = container.target.clientHeight;
  let scrollHeight = container.target.scrollHeight;
  let fromTop = container.target.scrollTop;

  // If user scrolls to end of container, add more values to the end
  if (scrollHeight - height - 50 < fromTop) {
    setSliceValue(sliceValue + 25);
  }
  return;
};
