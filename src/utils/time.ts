const day = 60 * 60 * 24;
const hour = 60 * 60
const minute = 60

enum TimeNames {
  Days,
  Hours,
  Minuts,
  Seconds
}

function getHumanTimeFromSeconds(seconds: number): [number, number, number, number] {
  const days = Math.floor(seconds / day);
  let remainder = seconds % day;

  const hours = Math.floor(remainder / hour);
  remainder = remainder % hour;

  const minutes = Math.floor(remainder / minute);
  remainder = remainder % minute;

  return [days, hours, minutes, remainder];
}

function modifyHumanTimeToString(seconds: number): string {
  const timePeriods = getHumanTimeFromSeconds(seconds);
  let result = '';

  timePeriods.forEach((element: number, index: number) => {
    if (element) {
      result += `${TimeNames[index]} ${element} `;
    }
  })
  return result;
}

export { getHumanTimeFromSeconds, modifyHumanTimeToString };