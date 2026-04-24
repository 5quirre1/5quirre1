const photos = [
    '/assets/misc/photos-i-took/102_0952.JPG',
    '/assets/misc/photos-i-took/102_0978.JPG',
    '/assets/misc/photos-i-took/102_0979.JPG',
    '/assets/misc/photos-i-took/102_1007.JPG',
    '/assets/misc/photos-i-took/PIC_0179.JPG',
    '/assets/misc/photos-i-took/PIC_0222.JPG',
    '/assets/misc/photos-i-took/PIC_0290.JPG',
    '/assets/misc/photos-i-took/PIC_0388.JPG',
    '/assets/misc/photos-i-took/PIC_0400.JPG',
];

document.getElementById('random-photo').src = photos[Math.floor(Math.random() * photos.length)];