import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Roles } from '../../common/decorators/roles.decorator';
import { GetSessionUser } from '../../common/decorators/session-user.decorator';
import { PaginationQueryDto } from '../../common/dtos/pagination-query.dto';
import { UserRole } from '../../common/enum/enum-user-role';
import { AuthGuard, RolesGuard } from '../../common/guard';
import { SubscriptionDownloadGuard } from '../../common/guard/subscription-download.guard';
import { SubscriptionGuard } from '../../common/guard/subscription.guard';
import { ConversationRenameDto } from '../dtos/conversation.dto';
import { ProcessDocumentDto, ResearchLawDto } from '../dtos/prompt.dto';
import { UpdateNoteDto } from '../dtos/update.note.dto';
import { PromptService } from '../service/prompt.service';

@Controller('model')
@ApiTags('Prompt')
@ApiBearerAuth()
@UseGuards(AuthGuard, RolesGuard)
export class PromptController {
    constructor(private readonly promptService: PromptService) { }

    @Post('formulation')
    @UseInterceptors(FileInterceptor('document'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: ProcessDocumentDto })
    @Roles(UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
    async uploadDocument(@UploadedFile() file: Express.Multer.File) {
        return this.promptService.processDocument(file);
    }

    @Post('contextualize')
    @UseGuards(SubscriptionGuard)
    @UseInterceptors(FileInterceptor('document'))
    @ApiConsumes('multipart/form-data')
    @ApiBody({ type: ResearchLawDto })
    @Roles(UserRole.USER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
    async researchLaw(
        @UploadedFile() file: Express.Multer.File,
        @GetSessionUser() user: any,
        @Res() res: Response
    ) {
        return this.promptService.researchLaw(file, user, res);
    }

    @Post('conversation/:conversationId/:responseId/note')
    @Roles(UserRole.USER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
    async addNoteToResponse(
        @Param('conversationId') conversationId: string,
        @Param('responseId') responseId: string,
        @GetSessionUser() user: any,
        @Body() note: UpdateNoteDto
    ) {
        return this.promptService.addNoteToResponse(conversationId, responseId, note, user);
    }

    @Delete('conversation/note/:noteId')
    @Roles(UserRole.USER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
    async deleteNoteToResponse(
        @Param('noteId') noteId: string,
        @GetSessionUser() user: any,
    ) {
        return this.promptService.deleteNoteToResponse(noteId, user);
    }


    @Patch('conversation/note/:noteId')
    @Roles(UserRole.USER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
    async updateNoteToResponse(
        @Param('noteId') noteId: string,
        @GetSessionUser() user: any,
        @Body() note: UpdateNoteDto
    ) {
        return this.promptService.updateNoteToResponse(noteId, user, note);
    }


    @Get('conversation/notes')
    @Roles(UserRole.USER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
    async getNotesByUserID(
        @GetSessionUser() user: any,
        @Query() pagintationDto: PaginationQueryDto,
    ) {
        return this.promptService.getNotesByUserID(pagintationDto, user);
    }


    @Get('conversations')
    @Roles(UserRole.USER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
    async getConversations(
        @Query() pagintationDto: PaginationQueryDto,
        @GetSessionUser() user: any
    ) {
        return this.promptService.getConversations(pagintationDto, user);
    }

    @Get('conversation/:id')
    @Roles(UserRole.USER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
    async getConversationById(
        @Param('id') id: string,
        @GetSessionUser() user: any,
        @Res() res: Response
    ) {
        return this.promptService.getConversationById(id, user, res);
    }

    @Get('conversation/:id/download')
    @Roles(UserRole.USER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
    @UseGuards(SubscriptionDownloadGuard)
    async downloadConversationById(
        @Param('id') id: string,
        @GetSessionUser() user: any,
        @Res() res: Response
    ) {
        return this.promptService.downloadConversationById(id, user, res);
    }

    @Patch('conversation/:id/rename')
    @Roles(UserRole.USER, UserRole.ADMINISTRATOR, UserRole.SYSTEM_ADMINISTRATOR)
    async renameConversionById(
        @Param('id') id: string,
        @GetSessionUser() user: any,
        @Body() conversationRenameDto: ConversationRenameDto
    ) {
        return this.promptService.renameConversation(id, conversationRenameDto, user);
    }




}
