import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Observable } from 'rxjs';
import { extractLawSections } from 'src/utils/law-ref-extract';
import { processPDFAndExtractLawSections } from 'src/utils/law-section-extract';
import { chunkArray } from 'src/utils/utils';
import { Law, LawDocument } from './entity/law.entity';


@Injectable()
export class LawService {
  constructor(@InjectModel(Law.name) private lawModel: Model<LawDocument>) { }

  // async processPDF(data: { buffer: Buffer, filename: string }): Promise<Law[]> {
  async processPDF(data: { buffer: Buffer, filename: string }): Promise<any> {

    const lawSections = await processPDFAndExtractLawSections(data.buffer, data.filename);

    const chunks = chunkArray(lawSections, 100);

    const processedLaws: Law[] = [];

    for (const chunk of chunks) {
      const laws = await Promise.all(
        chunk.map(section =>
          this.lawModel.findOneAndUpdate(
            { $and: [{ law: section.law }, { sectionTitle: section.sectionTitle }] },
            section,
            { upsert: true, new: true, setDefaultsOnInsert: true }
          )
        )
      );
      processedLaws.push(...laws);
    }

    return processedLaws;
  }

  async researchLaw(data: { buffer: Buffer, filename: string }): Promise<Observable<any>> {
    const references = await extractLawSections(data.buffer, data.filename);

    return new Observable(observer => {
      (async () => {

        if (references.length === 0) {
          observer.next({
            error: true,
            message:`No references found in the document. Please make sure "${data.filename}" document contains law references.`
          });
          observer.complete();
          return;
        }
        let isResponseSended = false;
        for (const chunk of chunkArray(references, 5)) {
          const queryResults = await this.queryLawChunk(chunk);
          queryResults.forEach(result => observer.next(result));
          isResponseSended = true;
        }

        if (!isResponseSended) {
          observer.next({
            error: true,
            message: "Something is wrong while generating response"
          });
        }
        observer.complete();
      })();
    });
  }

  private async queryLawChunk(chunk: any[]): Promise<any[]> {
    const queries = chunk.map(item => ({
      sectionTitle: { $regex: new RegExp(`^${item?.match.split(" ")[0]}\\s*${item.section}\\b`, 'i') },
      law: { $regex: new RegExp(`\\b${item.law}\\b`, 'i') }
    }));

    const results = await this.lawModel.find({ $or: queries });

    return results.map(result => ({
      ...chunk.find(item =>
        new RegExp(`\\b${item.section}\\b`, 'i').test(result.sectionTitle) &&
        new RegExp(`\\b${item.law}\\b`, 'i').test(result.law)
      ),
      result: {
        ...result.toObject(),
        _id: undefined,
        __v: undefined,
        createdAt: undefined,
        updatedAt: undefined,
        contents_string: result.contents?.map(item => item.str).join('\n')
      },
    }));
  }
}
