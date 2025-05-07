declare module 'html2pdf.js' {
  function html2pdf(): {
    from(element: HTMLElement): any;
    set(options: any): any;
    save(): void;
  };
  export default html2pdf;
}
