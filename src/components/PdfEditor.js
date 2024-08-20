"use client";
import React, { useRef, useEffect } from "react";
import { BLANK_PDF, getInputFromTemplate } from "@pdfme/common";
import { Designer } from "@pdfme/ui";
import { generate } from "@pdfme/generator";
import { signature } from "./SignaturePad";
import { text } from "@pdfme/schemas";

const PdfEditor = () => {
  const containerRef = useRef(null);
  const designerRef = useRef(null);

  useEffect(() => {
    const domContainer = containerRef.current;
    const template = {
      basePdf: BLANK_PDF,
      schemas: [{}],
    };

    if (domContainer) {
      designerRef.current = new Designer({
        domContainer,
        template,
        plugins: getPlugins(),
      });
    }
  }, []);

  const getPlugins = () => ({
    Text: text,
    Signature: signature,
  });

  const readFile = (file, type) => {
    return new Promise((resolve) => {
      const fileReader = new FileReader();
      fileReader.onload = (e) => resolve(e.target.result);
      fileReader.readAsDataURL(file);
    });
  };

  const onUploadPdf = (e) => {
    if (e.target?.files[0]) {
      readFile(e.target.files[0], "dataURL").then((basePdf) => {
        if (designerRef.current) {
          const updatedTemplate = {
            ...designerRef.current.getTemplate(),
            basePdf,
          };
          designerRef.current.updateTemplate(updatedTemplate);
        }
      });
    }
  };

  const generatePDF = async () => {
    if (!designerRef.current) return;

    const template = designerRef.current.getTemplate();
    const inputs =
      designerRef.current.getInputs?.() || getInputFromTemplate(template);

    try {
      const pdf = await generate({
        template,
        inputs,

        plugins: getPlugins(),
      });

      const blob = new Blob([pdf.buffer], { type: "application/pdf" });
      window.open(URL.createObjectURL(blob));
    } catch (e) {
      alert("An error occurred while generating the PDF.");
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full sm:justify-center">
        <label
          className="cursor-pointer text-white bg-blue-600 border-0 py-2 px-6 focus:outline-none hover:bg-blue-700 rounded text-xl"
          htmlFor="pdfInput"
        >
          Select PDF File
        </label>
        <input
          id="pdfInput"
          type="file"
          accept="application/pdf"
          onChange={onUploadPdf}
          className="hidden"
        />

        <button
          onClick={generatePDF}
          className="text-white bg-blue-600 border-0 py-2 px-6 focus:outline-none hover:bg-blue-700 rounded text-xl"
        >
          Generate PDF
        </button>
      </div>

      <div
        ref={containerRef}
        style={{ width: "100%", height: `calc(100vh - 160px)` }}
        className="mt-6"
      />
    </div>
  );
};

export default PdfEditor;
