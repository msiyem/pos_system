export function focusFirstError(errors){
  const firstErrorKey = Object.keys(errors)[0];
  if(!firstErrorKey) return;

  const el = document.querySelector(
    `[name="${firstErrorKey}"]`
  );

  if(el){
    el.focus();
    el.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  }
}