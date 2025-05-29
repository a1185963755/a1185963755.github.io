---
title: nest实现定时任务
date: 2025-05-29T15:00:00Z
info: 在Nest.js中，`DiscoveryService` 是一个核心工具类，主要用于动态扫描应用程序中注册的控制器（Controllers）和服务（Providers），并获取它们的元数据（Metadata）
tags:
  - nest
  - cron
---
# nest实现定时任务
在平常开发中，我们经常遇到需要定时执行任务的场景，比如定时发送邮件、定时更新缓存、定时备份数据等。Nest.js提供了多种方式来实现定时任务，依靠依赖注入的机制，在nest应用启动过程中会自动扫描发现并初始化定时任务，下面我将介绍最简单实用方法，使用`@nestjs/schedule`模块。

首先我们需要安装`@nestjs/schedule`模块：
```bash
npm install @nestjs/schedule
```

## **如何使用**
我们需要在全局注册`@nestjs/schedule`模块,也就是在我们的文件`app.module.ts`中加入：
```typescript
...
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    ...,
    ScheduleModule.forRoot(),
  ],
})
export class AppModule {}
```
这样全局注册模块之后，我们就可以愉快地在各模块中使用Cron表达式来定义定时任务了。
## **代码示例**
以下是一个简单的使用Cron表达式来执行定时任务的示例：
```typescript
...
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class ExampleService {
  constructor() {}

  // 定义一个定时任务，每10秒执行一次
  @Cron(CronExpression.EVERY_10_SECONDS)
  doSomeThing() {
    // 执行定时任务的逻辑
    console.log('定时任务执行中...');
  }
}
```
## **拓展：常用Cron表达式常量**
`Cron表达式`是一种用于定义定时任务执行时间的字符串格式。Nest.js提供了一些预定义的Cron表达式常量，如：
```typescript
export enum CronExpression {
  EVERY_SECOND = '* * * * * *',
  EVERY_5_SECONDS = '*/5 * * * * *',
  EVERY_10_SECONDS = '*/10 * * * * *',
  EVERY_30_SECONDS = '*/30 * * * * *',
  EVERY_MINUTE = '0 * * * * *',
  EVERY_5_MINUTES = '0 */5 * * * *',
  EVERY_10_MINUTES = '0 */10 * * * *',
  EVERY_30_MINUTES = '0 */30 * * * *',
  EVERY_HOUR = '0 0 * * * *',
  EVERY_2_HOURS = '0 0 */2 * * *',
  EVERY_DAY = '0 0 0 * * *',
  EVERY_DAY_AT_1AM = '0 0 1 * * *',
  EVERY_DAY_AT_2AM = '0 0 2 * * *',
  EVERY_WEEK = '0 0 0 * * 0',
  EVERY_MONDAY = '0 0 0 * * 1',
  EVERY_QUARTER = '0 0 0 1 */3 *',
  EVERY_YEAR = '0 0 0 1 1 *',
}
```
