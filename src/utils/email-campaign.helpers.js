export const getTemplateEdited = (selectorId) => {
  const template = document.querySelector(selectorId);
  return template.outerHTML;
};

export const getElement = (selectorId) => {
  const element = document.querySelector(selectorId);
  return element;
};

export const getElements = (selectorClassName) => {
  const element = document.querySelectorAll(selectorClassName);
  return element;
};
