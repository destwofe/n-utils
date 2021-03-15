export class AsyncQueue<T> {
  Queue: Array<() => Promise<T>>
  res: T[]

  constructor (queue: Array<() => Promise<T>>) {
    this.Queue = queue
    this.res = []
  }

  async Execute (pSize: number): Promise<T[]> {
    const workers = []
    for (let index = 0; index < pSize; index++) {
      workers.push(this.execute(index))
    }
    await Promise.all(workers)
    return this.res
  }

  private async execute (n: number): Promise<void> {
    const [fn, ...remain] = this.Queue
    if (fn == null) return
    this.Queue = remain
    this.res.push(await fn())
    if (this.Queue.length !== 0) return await this.execute(n)
  }
}
