import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LawService } from './law.service';

@Controller('law')
export class LawController {
  constructor(private readonly lawService: LawService) { }

  @MessagePattern({ cmd: 'train_law' })
  async trainLaw(@Payload() data: { buffer: Buffer, filename: string }) {

    const lawSections = await this.lawService.processPDF(data);
    return {
      message: "Training Success.",
      data: lawSections
    };
  }

  @MessagePattern({ cmd: 'research_law' })
  async researchLaw(@Payload() data: { buffer: Buffer, filename: string }) {

    return this.lawService.researchLaw(data);
  }
}
