import fs from "fs/promises";
import PDFParser from "pdf2json";

export const parsePDF = async (filePath) => {
  try {
    //  Read file into buffer
    const buffer = await fs.readFile(filePath);

    const pdfParser = new PDFParser();

    const pdfData = await new Promise((resolve, reject) => {
      pdfParser.on("pdfParser_dataError", (errData) => {
        reject(errData?.parserError || new Error("Failed to parse PDF"));
      });

      pdfParser.on("pdfParser_dataReady", (data) => {
        resolve(data);
      });

      pdfParser.parseBuffer(buffer);
    });

    let rawText = typeof pdfParser.getRawTextContent === "function"
      ? pdfParser.getRawTextContent()
      : "";

    if (!rawText || rawText.trim().length === 0) {
      const decodePdf2JsonText = (t) => {
        if (typeof t !== "string") return "";
        try {
          return decodeURIComponent(t);
        } catch {
          return t;
        }
      };

      const pages = Array.isArray(pdfData?.Pages) ? pdfData.Pages : [];
      const reconstructedPages = pages.map((page) => {
        const texts = Array.isArray(page?.Texts) ? page.Texts : [];
        const lines = new Map();

        for (const item of texts) {
          const y = typeof item?.y === "number" ? item.y : 0;
          const x = typeof item?.x === "number" ? item.x : 0;
          const yKey = y.toFixed(2);

          const runs = Array.isArray(item?.R) ? item.R : [];
          const textChunk = runs
            .map((r) => decodePdf2JsonText(r?.T || ""))
            .join("")
            .trim();

          if (!textChunk) continue;

          const existing = lines.get(yKey) || [];
          existing.push({ x, text: textChunk });
          lines.set(yKey, existing);
        }

        const ordered = Array.from(lines.entries())
          .sort((a, b) => parseFloat(a[0]) - parseFloat(b[0]))
          .map(([, parts]) => parts.sort((a, b) => a.x - b.x).map((p) => p.text).join(" "));

        return ordered.join("\n");
      });

      rawText = reconstructedPages.join("\n\n").trim();
    }

    const numpages = Array.isArray(pdfData?.Pages) ? pdfData.Pages.length : undefined;

    console.log(
      ` PDF parsed: ${numpages ?? "?"} pages, ${rawText.length} characters`
    );

    return {
      text: rawText,
      numpages,
      info: pdfData?.Meta,
      metadata: pdfData,
    };
  } catch (error) {
    console.error("PDF parsing error:", error);
    throw new Error(`Failed to parse PDF: ${error.message}`);
  }
};


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


export const extractCandidateInfo = async (text) => {
    const safeText = typeof text === 'string' ? text : '';

    const emailMatch = safeText.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i);
    const phoneMatch = safeText.match(/(\+?\d{1,3}[\s-]?)?(\(?\d{3}\)?[\s-]?)?\d{3}[\s-]?\d{4}/);

    const firstLine = safeText
        .split(/\r?\n/)
        .map((l) => l.trim())
        .find((l) => l.length > 0);

    const name = firstLine && firstLine.length <= 80 ? firstLine : undefined;

    return {
        name,
        email: emailMatch?.[0],
        phone: phoneMatch?.[0],
        experience: undefined,
        education: undefined,
    };
}