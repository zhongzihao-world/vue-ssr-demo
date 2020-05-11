
import Vue from 'vue';

/** ----------全局提示---------- */

function getExactTime(date: Date, type: string): string {
  date = new Date(date);
  const year = date.getFullYear();
  const month = date.getMonth() + 1 < 10 ? `0${(date.getMonth() + 1) * 1}` : date.getMonth() + 1;
  const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
  const hours = date.getHours() < 10 ? `0${date.getHours()}` : date.getHours();
  const minutes = date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes();
  const seconds = date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds();
  if (type === '-') {
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } else if (type === '/') {
    return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`;
  } else if (type === '.') {
    return `${year}.${month}.${day} ${hours}:${minutes}:${seconds}`;
  } else {
    // eslint-disable-next-line no-useless-concat
    return `${year}年${month}月${day}日` + ` ${hours}:${minutes}:${seconds}`;
  }
}

Vue.filter('getExactTime', getExactTime);
