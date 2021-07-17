import './components/starter/scss/main.scss';
import MyLauncher from './components/starter/images/launcher.png';

const title = document.createElement('h1');
const title_text =  document.createTextNode('Mise en place du starter webpack');

const myIcon = new Image();
myIcon.src = MyLauncher;

title.appendChild(myIcon);
title.appendChild(title_text);
document.body.appendChild(title);

//Signature
console.log("%c🚀 webpack starter - native JS", "font-size: 1.5rem; padding: 20px 10px; margin: 0; background: hsl(271deg 49% 17% / 50%);");
console.log("%cBy Wilfried Jumelle - wjumelle@gmail.com", "font-size: 1rem; font-weight: bold;");