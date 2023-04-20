import { container } from 'tsyringe'

export class AppFactoryStatic {
  public create(modules: any[]) {
    modules.forEach(module => {
      console.log(module)
      container.resolve(module)
    })
  }
}

export const AppFactory = new AppFactoryStatic()
