const randomGen = () => Math.floor(Math.random() * 6) + 1;
export const randomPic = () => `/images/samples/${randomGen()}.jpeg`;
export const images = [
    { id: 1, src: randomPic(), alt: 'Image 1' },
    { id: 2, src: randomPic(), alt: 'Image 2' },
    { id: 3, src: randomPic(), alt: 'Image 3' },
    { id: 4, src: randomPic(), alt: 'Image 4' }
];
