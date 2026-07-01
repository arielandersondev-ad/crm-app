import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PdfService {
  private printer: any;

  constructor() {
    try {
      const PdfPrinter = require("pdfmake/src/printer");
      const vfs = require("pdfmake/build/vfs_fonts");

      const fontsDir = path.join(os.tmpdir(), "pdfmake-fonts");
      if (!fs.existsSync(fontsDir)) {
        fs.mkdirSync(fontsDir, { recursive: true });
        for (const [name, data] of Object.entries(vfs)) {
          fs.writeFileSync(path.join(fontsDir, name), Buffer.from(data as string, "base64"));
        }
      }

      const fonts = {
        Roboto: {
          normal: path.join(fontsDir, "Roboto-Regular.ttf"),
          bold: path.join(fontsDir, "Roboto-Medium.ttf"),
          italics: path.join(fontsDir, "Roboto-Italic.ttf"),
          bolditalics: path.join(fontsDir, "Roboto-MediumItalic.ttf"),
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
