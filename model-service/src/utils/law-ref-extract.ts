import pdfParse from 'pdf-parse';
import { escapeRegExp } from './utils.js';

interface PageContent {
    content: string[];
    pageNumber: string | null;
}

interface LawRefs {
    probableLine: string;
    probablePage: string;
    fullLine_String: string;
    match: string;
    section: string;
    subsection: string | null;
    sentence: string | null;
    number: string | null;
    alternative: string | null;
    additionalParagraph: string | null;
    law: string | null;
}

const lawReferenceRegex = /(?:§{1,2}|Art\.)\s*(\d+[a-z]?)(?:\s*(?:Abs\.|Absatz)\s*(\d+(?:–\d+)?))?(?:\s*(?:S\.|Satz)\s*(\d+))?(?:\s*(?:Nr\.|Nummer)\s*(\d+))?(?:\s*(?:Alt\.|Alternative)\s*(\d+))?(?:\s*(?:und|,)\s*(?:Abs\.|Absatz)\s*(\d+))?(?:\s+(?!(?:Abs\.|Absatz|S\.|Satz|Nr\.|Nummer|Alt\.|Alternative|und)\b)([A-Z][a-zA-Z]+))?/gi;

/**
 * Function to extract law sections from a PDF file
 * @param {Buffer} buffer - The buffer containing the PDF data
 * @returns {Promise<Array>} - Returns a promise that resolves with an array of extracted law sections
 */
export async function extractLawSections(buffer: Buffer, filename: string): Promise<Array<LawRefs>> {
    try{
        let pdfData = await pdfParse(buffer);
        let totalContainingLine = pdfData.text.split('\n').length;
    
        const legalTerms: string[] = ["Abs", "Absatz", "S .", "Satz", "Nr", "Nummer", "Alt", "Alternative", "und"]
    
        const pageData: PageContent[] = extractPageContentWithNumbers(pdfData.text);
        const results: Array<LawRefs> = [];
        let previousLine: string = '';
    
        pageData.forEach(({ pageNumber, content }, pageIndex) => {
            content.forEach((line, lineIndex) => {
                // check if the previousLine already has a match in results array
                let previousLineMatch = results.find(result => new RegExp(escapeRegExp(previousLine), "i").test(result.fullLine_String));
                let combinedLine: string = !previousLineMatch ? previousLine + ' ' + line : line;
                let match: RegExpExecArray | null;
    
                // Check if the combined line has a match
                while ((match = lawReferenceRegex.exec(combinedLine)) !== null) {
                    // Check if the match is a legal term
                    if (legalTerms.some(term => match[7]?.includes(term)) || !match[7]) {
                        continue;
                    }
    
                    let calculatedPage = pageNumber;
                    let calculateLine = (lineIndex + 1).toString();
                    if (pageNumber === null) {
                        calculatedPage = Math.ceil((lineIndex + 1) / (totalContainingLine / pdfData.numpages)).toString();
                        calculateLine = ((lineIndex + 1) % Math.ceil(totalContainingLine / pdfData.numpages)).toString();
                    }
    
                    results.push({
                        probableLine: calculateLine,
                        probablePage: calculatedPage,
                        fullLine_String: line,
                        match: match[0],
                        section: match[1],
                        subsection: match[2] || null,
                        sentence: match[3] || null,
                        number: match[4] || null,
                        alternative: match[5] || null,
                        additionalParagraph: match[6] || null,
                        law: match[7] || null
                    });
                }
    
                previousLine = line;
            });
    
        })
    
        return results;

    }catch(error){
        console.error(error.message);
        return [];
    }
}




function extractPageContentWithNumbers(pdfText: string): PageContent[] {
    const pageNumberPattern = /\n\s*(\d+)\s*\n/g;
    const result: PageContent[] = [];

    let content = '';
    let match: RegExpExecArray | null;

    let lastIndex = 0;

    while ((match = pageNumberPattern.exec(pdfText)) !== null) {

        content += pdfText.slice(lastIndex, match.index).trim();

        if (content) {
            result.push({
                content: content.split('\n'),
                pageNumber: match[1]
            });
        }

        content = '';
        lastIndex = match.index + match[0].length;
    }

    content = pdfText.slice(lastIndex).trim();
    if (content) {
        result.push({
            content: content.split('\n'),
            pageNumber: null
        });
    }

    return result;
}