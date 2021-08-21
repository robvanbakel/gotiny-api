const codeSpan = document.querySelector('h1 span')
const desc = document.querySelector('.description')
const tip = document.querySelector('.tip')

const allowedCharacters = /[^abcdefhkmnprstwxyz2345678]/g;

const code = window.location.pathname.substring(1,)

codeSpan.textContent = code

if (code.length != 6) {
  desc.innerHTML = 'Check your link and try again!'
  tip.innerHTML = '<strong>TIP:</strong><br>GoTiny links should always have 6 characters after the forward slash.'
} else if (/[A-Z]/.test(code)) {
  desc.innerHTML = 'Check your link and try again!'
  tip.innerHTML = '<strong>TIP:</strong><br>GoTiny links never contain capital letters.'
} else if (allowedCharacters.test(code)) {

  const restrictedChars = code.match(allowedCharacters)

  if (restrictedChars.length == 1) {
    const char = restrictedChars[0];
    desc.innerHTML = 'Check your link and try again!'

    if(/\d/.test(char)) {
        tip.innerHTML = `<strong>TIP:</strong><br>GoTiny links never contain the number <span class="char">${char}</span>.`
    } else {
        tip.innerHTML = `<strong>TIP:</strong><br>GoTiny links never contain the letter <span class="char">${char}</span>.`
    }
  }

}
