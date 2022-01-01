function main() {
  let counter = new Counter();
  for (let i = 0; i < 20; i++) {
    counter.incrementCounter();
    console.log(counter.getCounter());
  }
}

class Counter {
  private counter = 0;
  getCounter() { return this.counter; }
  setCounter(c: number) { this.counter = c; }
  incrementCounter() {
    this.counter = this.counter + 1;
  }
}
