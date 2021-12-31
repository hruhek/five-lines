class ArrayMinimum {
  constructor(private accmulator: number) {
  }

  process(arr: number[]) {
    for (let i = 0; i < arr.length; i++)
      if (this.accmulator > arr[i])
        this.accmulator = arr[i];
    return this.accmulator;
  }
}

class ArraySum {
  constructor(private accumulator: number) {
  }

  process(arr: number[]) {
    for (let i = 0; i < arr.length; i++)
      this.accumulator += arr[i];
    return this.accumulator;
  }
}
