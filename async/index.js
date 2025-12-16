console.log('1. Старт'); 
setTimeout(() => console.log('2. setTimeout 1'), 0);
Promise.resolve().then(() => console.log('3. Promise 1'));
setTimeout(() => console.log('4. setTimeout 2'), 0);
queueMicrotask(() => console.log('5. queueMicrotask'));
console.log('6. Конец');

console.log(1); 
setTimeout(() => console.log(2));
Promise.resolve().then(() => console.log(3));
Promise.resolve().then(() => setTimeout(() => console.log(4)));
Promise.resolve().then(() => console.log(5));
setTimeout(() => console.log(6));
console.log(7);

console.log(1); 
setTimeout(() => console.log(2));
Promise.reject(3).catch(console.log);
new Promise(resolve => setTimeout(resolve)).then(() => console.log(4));
Promise.resolve(5).then(console.log);
console.log(6);
setTimeout(() => console.log(7),0);

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

//Очередь синх. тасков
//Web api
//Микрозадачи
//Макрозадачи
//Event
