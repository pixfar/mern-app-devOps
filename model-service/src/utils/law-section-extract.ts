// import { getDocument, PDFDocumentProxy } from 'pdfjs-dist';

// const require = createRequire(import.meta.url);
// const pdfParse = require("pdf-parse"); 
import pdfParse from "pdf-parse";

// Function to load and extract styled text content from a PDF

async function loadAndExtractStyledText(pdfData: Buffer) {
    let styledTextArray = [];

    try {
        await pdfParse(pdfData, {
            pagerender: render_page,
        });

        function render_page(pageData) {
            let render_options = {
                normalizeWhitespace: false,
                disableCombineTextItems: false
            };

            return pageData.getTextContent(render_options).then(lineInfo => {
                const excludedPatterns = [
                    /Ein Service des Bundesministeriums der Justiz sowie des Bundesamts für/,
                    /(?=.*\bSeite\b)(?=.*\bvon\b)/,
                    /Justiz ‒ www.gesetze-im-internet.de/,
                    /^\s*\S+\s*$/
                ];

                lineInfo.items.forEach(item => {
                    if ('str' in item) {
                        let exportableData = { ...item };
                        let isNotExcluded = excludedPatterns.every((regex) => !regex.test(exportableData.str));

                        if (isNotExcluded && exportableData.height !== 0) {
                            styledTextArray.push(exportableData);
                        }
                    }
                });

                return '';
            }).catch(err => {
                console.error("Error processing page:", err);
                throw new Error(err.message);
            });
        }

        return styledTextArray;
    } catch (err) {
        console.error("Error processing PDF:", err);
        throw new Error(err.message);
    }
}






function extractSections(data: any) {
    let sections = [];
    let currentSection = null;
    let isTitleActive = false;

    data.forEach(line => {
        const isTitleLine = line.fontName.includes("f2");
        const isContentLine = line.fontName.includes("f1");

        // If a title line is detected and no section is currently active
        if ((line.str.startsWith("§") || line.str.startsWith("Art ")) && isTitleLine && !isTitleActive) {
            if (currentSection !== null) {
                sections.push(currentSection);
            }
            currentSection = {
                title: line.str,
                contents: []
            };
            isTitleActive = true;
        }
        // If a title line is detected while a title is already active, append to the current title
        else if (isTitleActive && isTitleLine) {
            currentSection.title += ` ${line.str}`;
        }
        // If a content line is detected, add it to the content of the current section
        else if (isContentLine && currentSection !== null) {
            isTitleActive = false; // Title is no longer active once we start adding content
            currentSection.contents.push(line);
        }
        // If a new section is detected
        else if ((line.str.startsWith("§") || line.str.startsWith("Art ")) && isTitleLine && currentSection !== null) {
            sections.push(currentSection);
            currentSection = {
                title: line.str,
                contents: []
            };
            isTitleActive = true;
        }
    });

    // Push the last section if there is one
    if (currentSection !== null) {
        sections.push(currentSection);
    }

    return sections;
}

// Function to extract the title of the PDF document based on its content and file name
async function extractDocumentTitle(pdfName: string, data: any[]) {
    const keyword = pdfName.replace(".pdf", "").replace("_", " ");
    const pdfText = data.map(item => item.str).join('\n');
    const lines = pdfText.split('\n');
    const keywordLineIndex = lines.findIndex(line => line.includes(keyword));
    let titleLines = [];

    for (let i = keywordLineIndex; i >= 0; i--) {
        const trimmedLine = lines[i].trim();
        if (trimmedLine === '' || trimmedLine.includes('Seite') || trimmedLine.includes("www.gesetze-im-internet.de") || trimmedLine.includes("Ein Service des Bundesministeriums der Justiz sowie des Bundesamts für")) {
            break;
        }
        titleLines.unshift(trimmedLine);
    }

    const title = titleLines.join(' ');
    return {
        title: title ? title.trim() : "Unknown Title",
        law: keyword
    };
}

// Main function to orchestrate the extraction and saving of law sections from the PDF
async function processPDFAndExtractLawSections(pdfData: Buffer, pdfName: string) {
    try {
        const styledTextArray = await loadAndExtractStyledText(pdfData);
        const documentTitle = await extractDocumentTitle(pdfName, styledTextArray);
        // let lawSections = await identifyAndExtractLawSections(styledTextArray);
        let lawSections = extractSections(styledTextArray);
        // Include the document title in each section
        lawSections = lawSections.map(section => ({ ...section, documentTitle: documentTitle.title, law: documentTitle.law.replace("-", " ").replace("_", " "), sectionTitle: section.title, pdfName }));

        return lawSections;
    } catch (error) {
        console.error('Error processing PDF:', error);
        throw error;
    }
}

export {
    extractDocumentTitle, processPDFAndExtractLawSections
};
