import { HttpStatus, Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Response } from 'express';
import { Model, Types } from 'mongoose';
import { CONVERSATION_NOT_BELONGS_TO_YOU, CONVERSATION_NOT_FOUND, createApiResponse, DATA_FOUND, INTERNAL_SERVER_ERROR, NO_DATA_FOUND, RESPONSE_NOT_FOUND, SOMETHING_WENT_WRONG, SUCCESS_RESPONSE } from 'src/common/constants';
import { PaginationQueryDto } from 'src/common/dtos/pagination-query.dto';
import { UserRole } from 'src/common/enum';
import { SubscriptionService } from 'src/subscription/service/subscription.service';
import { ConversationRenameDto } from '../dtos/conversation.dto';
import { UpdateNoteDto } from '../dtos/update.note.dto';
import { Note } from '../entities/note.entity';
import { Conversation } from '../entities/prompt.entity';
import { DocumentExportService } from './document-export.service';


@Injectable()
export class PromptService {
    constructor(
        @Inject('MODEL_SERVICE') private lawExtractClient: ClientProxy,
        @InjectModel(Conversation.name) private conversationModel: Model<Conversation>,
        @InjectModel(Note.name) private noteModel: Model<Note>,
        private readonly subscriptionService: SubscriptionService,
        private readonly documentExportService: DocumentExportService
    ) { }

    async processDocument(file: Express.Multer.File) {
        const result = await this.lawExtractClient.send({ cmd: 'train_law' }, { buffer: file.buffer, filename: file.originalname }).toPromise();

        return result;
    }

    async researchLaw(file: Express.Multer.File, user: any, res: Response) {
        try {
            const result$ = this.lawExtractClient.send({ cmd: 'research_law' }, { buffer: file.buffer, filename: file.originalname });

            // Increment the prompt request count for the user

            if (user.role == UserRole.USER) {
                await this.subscriptionService.incrementPromptCount(user.sub)
            }

            const conversation = new this.conversationModel({
                name: file.originalname,
                user: user.sub,
                responses: []
            });

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Transfer-Encoding', 'chunked');
            res.setHeader('Content-Encoding', 'utf-8');
            res.write(JSON.stringify(conversation), 'utf-8');

            result$.subscribe({
                next: async (data) => {
                    data._id = new Types.ObjectId();

                    if (data?.error) {
                        res.write(JSON.stringify(data), 'utf-8');
                        return;
                    }
                    let properEncodedData = JSON.parse(Buffer.from(JSON.stringify(data), 'utf-8').toString('utf-8'));
                    conversation.responses.push(properEncodedData);
                    data.result.contents = undefined;
                    res.write(JSON.stringify(properEncodedData), 'utf-8');
                },
                complete: async () => {
                    try {
                        conversation.streamCompleted = true;
                        await conversation.save();
                        res.end();
                    } catch (err) {
                        console.error('Error saving conversation:', err);
                        res.status(500).end(JSON.stringify({ error: INTERNAL_SERVER_ERROR }));
                    }
                },
                error: async (err) => {
                    console.error('Error in research_law:', err);
                    try {
                        conversation.streamCompleted = true;
                        await conversation.save();
                    } catch (saveErr) {
                        console.error('Error saving conversation after research_law error:', saveErr);
                    }
                    res.status(500).end(JSON.stringify({ error: INTERNAL_SERVER_ERROR, message: err.message }));
                },
            });
        } catch (err) {
            console.error('Unexpected error in researchLaw:', err);
            res.status(500).end(JSON.stringify({ error: INTERNAL_SERVER_ERROR, message: err.message }));
        }
    }



    async getConversations(paginationDto: PaginationQueryDto, user: any) {
        const { page, limit, sort, order, search, startDate, endDate } =
            paginationDto;
        const userId = user.sub;
        const pipeline: any[] = [];
        const matchStage: any = {};

        matchStage.user = userId;
        if (search) {
            const searchRegex = new RegExp(search, 'i');
            const allFields = Object.keys(this.conversationModel.schema.obj);

            matchStage.$or = allFields.map((field) => ({
                [field]: { $regex: searchRegex },
            }));
        }

        if (startDate && endDate) {
            const startDateObject = new Date(startDate);
            const endDateObject = new Date(endDate);

            matchStage.createdAt = {
                $gte: startDateObject,
                $lt: endDateObject,
            };
        }

        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        pipeline.push({ $count: 'total' });


        const totalResult = await this.conversationModel.aggregate(pipeline);
        const total = totalResult.length > 0 ? totalResult[0].total : 0;

        pipeline.pop();

        const startIndex = (page - 1) * limit;

        pipeline.push(
            { $skip: startIndex },
            { $limit: parseInt(limit.toString(), 10) },
            { $unset: "responses" },
        );

        const sortStage: any = {};
        sortStage[order] = sort === 'desc' ? -1 : 1;
        pipeline.push({ $sort: sortStage });

        const data = await this.conversationModel.aggregate(pipeline);
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        const nextPage = hasNextPage ? Number(page) + 1 : null;
        const prevPage = hasPrevPage ? Number(page) - 1 : null;

        if (data.length > 0) {
            return createApiResponse(HttpStatus.OK, SUCCESS_RESPONSE, DATA_FOUND, {
                data,
                pagination: {
                    total,
                    totalPages,
                    currentPage: Number(page),
                    hasNextPage,
                    hasPrevPage,
                    nextPage,
                    prevPage,
                },
            });
        } else {
            return createApiResponse(
                HttpStatus.OK,
                SUCCESS_RESPONSE,
                NO_DATA_FOUND,
            );
        }
    }


    async getConversationById(id: string, user: any, res: Response) {
        try {
            const userId = user.sub;
            const conversation = await this.conversationModel.findOne({ _id: id, user: userId }).select("-responses.result.contents");
            if (!conversation) {
                throw new NotFoundException(CONVERSATION_NOT_FOUND);
            }

            let responseIds = conversation.toObject().responses.map((response) => response._id.toString());

            let notes = await this.noteModel.find({ responseId: { $in: responseIds } });

            const conversationDetails = { ...conversation.toObject(), responses: [] };

            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Transfer-Encoding', 'chunked');
            res.setHeader('Content-Encoding', 'utf-8');
            res.write(JSON.stringify(conversationDetails), 'utf-8');
            let responses = conversation.responses;
            if (responses) {
                responses.forEach((response) => {
                    let note = notes.find((note) => note.responseId.toString() === response._id.toString());
                    response.result.contents = undefined;
                    if (note) {
                        response.note = note;
                    }
                    res.write(JSON.stringify(response), 'utf-8');
                });
            }
            res.end();
        } catch (err) {
            res.status(500).send(INTERNAL_SERVER_ERROR);
        }
    }

    async downloadConversationById(id: string, user: any, res: Response) {
        try {
            const userId = user.sub;
            const conversation = await this.conversationModel.findOne({ _id: id, user: userId }).select("-responses.result.contents");
            if (!conversation) {
                throw new NotFoundException(CONVERSATION_NOT_FOUND);
            }

            let responseIds = conversation.toObject().responses.map((response) => response._id.toString());

            let notes = await this.noteModel.find({ responseId: { $in: responseIds } });
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader('Content-Disposition', `attachment; filename=${conversation.name}.pdf`);
            conversation.responses.map((response) => {
                let note = notes.find((note) => note.responseId.toString() === response._id.toString());
                response.result.contents = undefined;
                if (note) {
                    response.note = note;
                }
                return response;
            });

            let pdfBuffer = await this.documentExportService.handlePdf(conversation);

            // Decrease download count for the conversation
            await this.subscriptionService.decrementDownloadCount(user.sub)

            res.send(pdfBuffer);
        } catch (err) {
            res.status(500).send(INTERNAL_SERVER_ERROR);
        }
    }


    async renameConversation(id: string, renameConversationDto: ConversationRenameDto, user: any) {
        try {
            const userId = user.sub;
            const conversation = await this.conversationModel.findOne({ _id: id, user: userId }).select("-responses");
            if (!conversation) {
                throw new NotFoundException(CONVERSATION_NOT_FOUND);
            }
            conversation.name = renameConversationDto.name;
            await conversation.save();
            return createApiResponse(HttpStatus.OK, SUCCESS_RESPONSE, DATA_FOUND, conversation);
        } catch (err) {
            throw new NotFoundException(CONVERSATION_NOT_FOUND);
        }
    }


    async addNoteToResponse(conversationId: string, responseId: string, updateNoteDto: UpdateNoteDto, user: any) {
        try {
            const userId = user.sub;
            const conversation = await this.conversationModel.findOne({ _id: new Types.ObjectId(conversationId), user: userId });
            if (!conversation) {
                throw new NotFoundException(CONVERSATION_NOT_FOUND);
            }

            if (conversation.user.toString() !== userId.toString()) {
                throw new NotFoundException(CONVERSATION_NOT_BELONGS_TO_YOU);
            }

            let isResponseExist = conversation.responses.find((response) => response._id.toString() === responseId.toString());
            if (!isResponseExist) {
                throw new NotFoundException(RESPONSE_NOT_FOUND);
            }

            let updatedNote = await this.noteModel.findOneAndUpdate(
                { responseId: responseId.toString(), userId: userId.toString(), conversationId: conversationId.toString() },
                { ...updateNoteDto },
                { upsert: true, new: true }
            );

            const plainUpdatedNote = updatedNote.toObject();

            return createApiResponse(HttpStatus.OK, SUCCESS_RESPONSE, DATA_FOUND, plainUpdatedNote);
        } catch (err) {
            throw new InternalServerErrorException(SOMETHING_WENT_WRONG + err.message);
        }
    }


    async deleteNoteToResponse(noteId: string, user: any) {
        try {
            let deleteNote = await this.noteModel.deleteOne(
                { userId: user.sub.toString(), _id: noteId.toString() }
            );
            return createApiResponse(HttpStatus.OK, SUCCESS_RESPONSE, DATA_FOUND, deleteNote);
        } catch (err) {
            throw new InternalServerErrorException(SOMETHING_WENT_WRONG + err.message);
        }
    }

    async updateNoteToResponse(noteId: string, user: any, note: UpdateNoteDto) {
        try {
            let updateNote = await this.noteModel.findOneAndUpdate(
                { userId: user.sub.toString(), _id: noteId.toString() },
                note
            );
            return createApiResponse(HttpStatus.OK, SUCCESS_RESPONSE, DATA_FOUND, updateNote);
        } catch (err) {
            throw new InternalServerErrorException(SOMETHING_WENT_WRONG + err.message);
        }
    }

    async getNotesByUserID(pagintationDto: PaginationQueryDto, user: any) {
        try {
            const { page, limit, sort, order, search, startDate, endDate } =
                pagintationDto;
            const userId = user.sub;
            const pipeline: any[] = [];
            const matchStage: any = {};

            matchStage.userId = userId;
            if (search) {
                const searchRegex = new RegExp(search, 'i');
                const allFields = Object.keys(this.noteModel.schema.obj);

                matchStage.$or = allFields.map((field) => ({
                    [field]: { $regex: searchRegex },
                }));
            }

            if (startDate && endDate) {
                const startDateObject = new Date(startDate);
                const endDateObject = new Date(endDate);

                matchStage.createdAt = {
                    $gte: startDateObject,
                    $lt: endDateObject,
                };
            }

            if (Object.keys(matchStage).length > 0) {
                pipeline.push({ $match: matchStage });
            }

            pipeline.push({ $count: 'total' });


            const totalResult = await this.noteModel.aggregate(pipeline);
            const total = totalResult.length > 0 ? totalResult[0].total : 0;

            pipeline.pop();

            const startIndex = (page - 1) * limit;

            pipeline.push(
                { $skip: startIndex },
                { $limit: parseInt(limit.toString(), 10) },
                { $unset: "responses" },
            );

            const sortStage: any = {};
            sortStage[order] = sort === 'desc' ? -1 : 1;
            pipeline.push({ $sort: sortStage });

            const data = await this.noteModel.aggregate(pipeline);
            const totalPages = Math.ceil(total / limit);
            const hasNextPage = page < totalPages;
            const hasPrevPage = page > 1;
            const nextPage = hasNextPage ? Number(page) + 1 : null;
            const prevPage = hasPrevPage ? Number(page) - 1 : null;

            if (data.length > 0) {
                return createApiResponse(HttpStatus.OK, SUCCESS_RESPONSE, DATA_FOUND, {
                    data,
                    pagination: {
                        total,
                        totalPages,
                        currentPage: Number(page),
                        hasNextPage,
                        hasPrevPage,
                        nextPage,
                        prevPage,
                    },
                });


            }
        } catch (err) {
            console.log(err)
            return new InternalServerErrorException(INTERNAL_SERVER_ERROR)
        }
    }


}
