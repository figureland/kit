import { system } from './system'

export class Manager {
  protected readonly system = system()
  public readonly use = this.system.use
  public readonly unique = this.system.unique
  public readonly dispose = this.system.dispose
}
