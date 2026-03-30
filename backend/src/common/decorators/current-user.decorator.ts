import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface CurrentUserData {
  uid: string;
  email: string;
  emailVerified: boolean;
}

export const CurrentUser = createParamDecorator(
  (data: keyof CurrentUserData | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as CurrentUserData;

    if (data) {
      return user?.[data];
    }

    return user;
  },
);
