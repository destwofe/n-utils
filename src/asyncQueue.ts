export class AsyncQueue {
  Queue: Array<() => Promise<any>>
  res: any[]

  constructor (queue: Array<() => Promise<any>>) {
    this.Queue = queue
    this.res = []
  }

  async Execute (pSize: number): Promise<any[]> {
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
    console.log('asyncQueue', n, this.res.length)
    if (this.Queue.length !== 0) return await this.execute(n)
  }
}
