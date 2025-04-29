import { 
    Controller, 
    Get, 
    Post, 
    Patch, 
    Delete, 
    Body, 
    Req, 
    UseGuards, 
    HttpStatus,
    HttpCode,
  } from '@nestjs/common';
  import { SettingsService } from './settings.service';
  import { CreateSettingsDto } from './dto/create-settings.dto';
  import { UpdateSettingsDto } from './dto/update-settings.dto';
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
  
  @ApiTags('settings')
  @Controller('settings')
  @UseGuards(JwtAuthGuard)
  export class SettingsController {
    constructor(private readonly settingsService: SettingsService) {}
  
    @Get()
    @ApiOperation({ summary: 'Get current user settings' })
    @ApiResponse({ 
      status: HttpStatus.OK, 
      description: 'Returns the user settings' 
    })
    @ApiResponse({ 
      status: HttpStatus.NOT_FOUND, 
      description: 'Settings not found for the user' 
    })
    async getSettings(@Req() req) {
      const userId = req.user.id;
      return this.settingsService.getOrCreateSettings(userId);
    }
  
    @Post()
    @ApiOperation({ summary: 'Create settings for the current user' })
    @ApiResponse({ 
      status: HttpStatus.CREATED, 
      description: 'Settings have been created' 
    })
    async createSettings(@Req() req, @Body() createSettingsDto: CreateSettingsDto) {
      const userId = req.user.id;
      return this.settingsService.createSettings(userId, createSettingsDto);
    }
  
    @Patch()
    @ApiOperation({ summary: 'Update settings for the current user' })
    @ApiResponse({ 
      status: HttpStatus.OK, 
      description: 'Settings have been updated' 
    })
    async updateSettings(@Req() req, @Body() updateSettingsDto: UpdateSettingsDto) {
      const userId = req.user.id;
      return this.settingsService.updateSettings(userId, updateSettingsDto);
    }
  
    @Delete()
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete settings for the current user' })
    @ApiResponse({ 
      status: HttpStatus.NO_CONTENT, 
      description: 'Settings have been deleted' 
    })
    async deleteSettings(@Req() req) {
      const userId = req.user.id;
      await this.settingsService.deleteSettings(userId);
    }
  }