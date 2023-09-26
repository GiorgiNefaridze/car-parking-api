interface ItextValidator {
  (texts: string[]): boolean;
}

export const textValidator: ItextValidator = (texts) => {
  return texts?.every((text) => text?.length >= 3);
};
