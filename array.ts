class BatchProcessor {
  constructor(private processor: ElementProcessor) {
  }

  process(arr: number[]) {
    for (let i = 0; i < arr.length; i++)
      this.processor.processElement(arr[i]);
    return this.processor.getAccumulator();
  }
}

interface ElementProcessor {
  processElement(e: number): void;

  getAccumulator(): number;
}

class MinimalProcessor implements ElementProcessor {
  constructor(private accumulator: number) {
  }

  processElement(e: number) {
    this.accumulator += e;
  }

  getAccumulator(): number {
    return this.accumulator;
  }

}

class MinimumProcessor implements ElementProcessor{
  constructor(private accumulator: number) {
  }

  processElement(e: number) {
    if (this.accumulator > e)
      this.accumulator = e;
  }

  getAccumulator(): number {
    return this.accumulator;
  }
}
