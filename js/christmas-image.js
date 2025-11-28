const allBgs = [
    'img/christmas/christmas.jpg',
    'img/christmas/christmas.webp',
    'img/christmas/christmas2.webp',
    'img/christmas/christmas3.png',
    'img/christmas/christmas4.jpg',
];
const randin = Math.floor(Math.random() * allBgs.length);
document.getElementById('christmas-bg').src = allBgs[randin];