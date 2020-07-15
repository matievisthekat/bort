interface String {
  title(): string;
}

String.prototype.title = function (): string {
  return this.replace(/\w\S*/g, function (txt: string) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
};
