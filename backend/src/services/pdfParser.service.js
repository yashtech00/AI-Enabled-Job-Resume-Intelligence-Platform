// src/services/pdfParser.js
import pdfParse from 'pdf-parse';
import fs from 'fs/promises';

/**
 * Parse PDF file and extract text
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<Object>} - Parsed PDF data
 */
export const parsePDF = async (filePath) => {
    try {
        // Read file
        const dataBuffer = await fs.readFile(filePath);

        // Parse PDF
        const data = await pdfParse(dataBuffer);

        console.log(`✅ PDF parsed: ${data.numpages} pages, ${data.text.length} characters`);

        return {
            text: data.text,
            numpages: data.numpages,
            info: data.info,
            metadata: data.metadata
        };

    } catch (error) {
        console.error('PDF parsing error:', error);
        throw new Error(`Failed to parse PDF: ${error.message}`);
    }
};

/**
 * Clean extracted text from PDF
 * @param {string} text - Raw text from PDF
 * @returns {string} - Cleaned text
 */
export const cleanPDFText = (text) => {
    try {
        let cleaned = text;

        // Remove excessive whitespace
        cleaned = cleaned.replace(/\s+/g, ' ');

        // Remove special characters but keep basic punctuation
        cleaned = cleaned.replace(/[^\w\s.,;:()\-@+]/g, '');

        // Trim
        cleaned = cleaned.trim();

        console.log(`✅ Cleaned text: ${cleaned.length} characters`);

        return cleaned;

    } catch (error) {
        console.error('Text cleaning error:', error);
        return text; // Return original if cleaning fails
    }
};

/**
 * Extract text from PDF with cleaning
 * @param {string} filePath - Path to PDF file
 * @returns {Promise<string>} - Cleaned extracted text
 */
export const extractTextFromPDF = async (filePath) => {
    try {
        const pdfData = await parsePDF(filePath);
        const cleanedText = cleanPDFText(pdfData.text);

        return cleanedText;

    } catch (error) {
        console.error('PDF text extraction error:', error);
        throw new Error(`Failed to extract text from PDF: ${error.message}`);
    }
};