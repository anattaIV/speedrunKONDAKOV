//1. Старт - Синхронный код
//6. Конец - Синхронный код
//3. Promise 1 - Микротаск
//5. queueMicrotask - Микротаск
//2. setTimeout 1 - Макротаск
//4. setTimeout 2 - Макротаск
console.log('1. Старт');
setTimeout(() => console.log('2. setTimeout 1'), 0);
Promise.resolve().then(() => console.log('3. Promise 1'));
setTimeout(() => console.log('4. setTimeout 2'), 0);
queueMicrotask(() => console.log('5. queueMicrotask'));
console.log('6. Конец');
//--------------------
//1 - Синхронный код
//7 - Синхронный код
//3 - после микротаска then выполняется сразу после пред.
//5 - после микротаска then выполняется сразу после пред.
//2 - макротаск
//6 - макротаск
//4 - .then + макротаск

console.log(1); 
setTimeout(() => console.log(2));
Promise.resolve().then(() => console.log(3));
Promise.resolve().then(() => setTimeout(() => console.log(4)));
Promise.resolve().then(() => console.log(5));
setTimeout(() => console.log(6));
console.log(7);
//---------------------
//1 - синхронный код
//6 - синхронный код
//3 - микротаск .catch
//5 - микротаск .then
//2 - макротаск 
//7 - макротаск
//4 - макротаск + микротаск

console.log(1); 
setTimeout(() => console.log(2));
Promise.reject(3).catch(console.log);
new Promise(resolve => setTimeout(resolve)).then(() => console.log(4));
Promise.resolve(5).then(console.log);
console.log(6);
setTimeout(() => console.log(7),0);

//------------------
//Первый then: 1
//Второй then: 2
//Ошибка: Ошибка! (во 2 выкидывается ошибка, потому 3 микротаск не выполняется)

Promise.resolve(1)
  .then(x => {
    console.log('Первый then:', x);
    return x + 1;
  })
  .then(x => {
    console.log('Второй then:', x);
    throw new Error('Ошибка!');
  })
  .then(x => console.log('Третий then:', x))
  .catch(error => console.log('Ошибка:', error.message));
