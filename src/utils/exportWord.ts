export const exportAsWord = (html: string, filename = 'project.doc') => {
  const header = '<html><head><meta charset="utf-8"></head><body>';
  const footer = '</body></html>';
  const source = header + html + footer;
  const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(source);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
};
