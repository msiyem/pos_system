import { focusFirstError } from "./focusFirstError";

export const useEnterNavigation = ({
  errors,
  submit,
}) => {
  const handleKeyDown = (e) =>{
    if(e.key !== 'Enter') return;
    if(e.target.type === "radio") {
      e.preventDefault();
      return;
    }

    const form = e.target.form;
    if(!form) return;

    e.preventDefault();

    const hasErrors = Object.keys(errors).length>0;

    if(hasErrors){
      focusFirstError(errors);
      return;
    }

    const elements = Array.from(form.elements).filter(
      (el) =>
        (el.tagName === "INPUT" &&
          el.type !== "radio" &&
          el.type !== "submit" &&
          !el.disabled) ||
        el.tagName === "SELECT" ||
        el.tagName === "TEXTAREA"
    );

    const index = elements.indexOf(e.target);

    if(index ===-1) return;

    if(index === elements.length - 1) {
      submit();
      return;
    }
    // e.preventDefault();
    if(index>-1){
      elements[index+1].focus();
    }
    
  }
  return handleKeyDown;
}