import { Injectable } from "@nestjs/common";

@Injectable()
export class PdfService {
  private printer: any;

  constructor() {
    try {
      const PdfPrinter = require("pdfmake/src/printer");
      const vfs = require("pdfmake/build/vfs_fonts");

      // Use the bundled fonts directly; a stale temporary directory may be incomplete.
      const fonts = {
        Roboto: {
          normal: Buffer.from(vfs["Roboto-Regular.ttf"], "base64"),
          bold: Buffer.from(vfs["Roboto-Medium.ttf"], "base64"),
          italics: Buffer.from(vfs["Roboto-Italic.ttf"], "base64"),
          bolditalics: Buffer.from(vfs["Roboto-MediumItalic.ttf"], "base64"),
        },
      };

      this.printer = new PdfPrinter(fonts);
    } catch (err) {
      console.error("[PdfService] Error al inicializar:", err);
      this.printer = null;
    }
  }

  async generatePdf(docDefinition: any): Promise<Buffer> {
    if (!this.printer) {
      throw new Error("pdfmake no está disponible");
    }

    return new Promise((resolve, reject) => {
      try {
        const doc = this.printer.createPdfKitDocument(docDefinition);
        const chunks: Buffer[] = [];
        doc.on("data", (c: Buffer) => chunks.push(c));
        doc.on("end", () => resolve(Buffer.concat(chunks)));
        doc.on("error", reject);
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }
}
