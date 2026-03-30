import {
  Controller,
  Get,
  Patch,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { FirebaseAuthGuard } from '../common/guards/firebase-auth.guard';
import {
  CurrentUser,
  CurrentUserData,
} from '../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(FirebaseAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Patch('profile')
  async updateProfile(
    @CurrentUser() user: CurrentUserData,
    @Body() dto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(user.uid, dto);
  }

  @Get('dashboard')
  async getDashboard(@CurrentUser() user: CurrentUserData) {
    return this.usersService.getDashboard(user.uid);
  }

  @Get('progress')
  async getProgress(
    @CurrentUser() user: CurrentUserData,
    @Query('moduleId') moduleId?: string,
  ) {
    return this.usersService.getProgress(user.uid, moduleId);
  }
}
