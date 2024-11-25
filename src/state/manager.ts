import { lifecycle } from './lifecycle'

export class Manager {
  protected readonly lifecycle = lifecycle()
  public readonly use = this.lifecycle.use
  public readonly unique = this.lifecycle.unique
  public readonly dispose = this.lifecycle.dispose
}
