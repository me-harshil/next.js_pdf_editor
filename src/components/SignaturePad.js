import { ZOOM, Plugin } from "@pdfme/common";
import SignaturePad from "signature_pad";
import { image } from "@pdfme/schemas";

const getEffectiveScale = (element) => {
  let scale = 1;
  while (element && element !== document.body) {
    const style = window.getComputedStyle(element);
    const transform = style.transform;
    if (transform && transform !== "none") {
      const localScale = parseFloat(
        transform.match(/matrix\((.+)\)/)?.[1].split(", ")[3] || "1"
      );
      scale *= localScale;
    }
    element = element.parentElement;
  }
  return scale;
};

export const signature = {
  ui: async (arg) => {
    const { schema, value, onChange, rootElement, mode, i18n } = arg;

    const canvas = document.createElement("canvas");
    canvas.width = schema.width * ZOOM;
    canvas.height = schema.height * ZOOM;
    const resetScale = 1 / getEffectiveScale(rootElement);
    canvas.getContext("2d").scale(resetScale, resetScale);

    const signaturePad = new SignaturePad(canvas);
    try {
      value
        ? signaturePad.fromDataURL(value, { ratio: resetScale })
        : signaturePad.clear();
    } catch (e) {
      console.error(e);
    }

    if (mode === "viewer" || (mode === "form" && schema.readOnly)) {
      signaturePad.off();
    } else {
      signaturePad.on();
      const clearButton = document.createElement("button");
      clearButton.style.position = "absolute";
      clearButton.style.zIndex = "1";
      clearButton.textContent = i18n("clear") || "x";
      clearButton.addEventListener("click", () => {
        onChange && onChange({ key: "content", value: "" });
      });
      rootElement.appendChild(clearButton);
      signaturePad.addEventListener("endStroke", () => {
        const data = signaturePad.toDataURL("image/png");
        onChange && data && onChange({ key: "content", value: data });
      });
    }
    rootElement.appendChild(canvas);
  },
  pdf: image.pdf,
  propPanel: {
    schema: {},
    defaultSchema: {
      type: "signature",
      content: "",
      position: { x: 0, y: 0 },
      width: 62.5,
      height: 37.5,
    },
  },
};
