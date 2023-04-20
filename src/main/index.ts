import 'reflect-metadata'

import { AppFactory } from '@main/core/factory'
import { AppModule } from '@main/modules/app/app.module'

AppFactory.create([AppModule])
