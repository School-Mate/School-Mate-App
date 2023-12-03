export function isValidURL(url: string) {
  var RegExp =
    /(http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;

  if (RegExp.test(url)) {
    return true;
  } else {
    return false;
  }
}
