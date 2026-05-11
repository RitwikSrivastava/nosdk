import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function buildResponsivePicture(dmUrl) {
  const picture = document.createElement('picture');

  const desktop = document.createElement('source');
  desktop.media = '(min-width: 900px)';
  desktop.srcset = dmUrl;
  picture.append(desktop);

  const tablet = document.createElement('source');
  tablet.media = '(min-width: 600px)';
  tablet.srcset = dmUrl;
  picture.append(tablet);

  const img = document.createElement('img');
  img.src = dmUrl;
  img.loading = 'lazy';
  picture.append(img);

  return picture;
}

export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const li = document.createElement('li');
    moveInstrumentation(row, li);

    const [imageCell, ...bodyCells] = [...row.children];

    const anchor = imageCell?.querySelector('a[href]');
    const dmUrl = anchor?.href || '';

    if (dmUrl) {
      const picture = buildResponsivePicture(dmUrl);
      imageCell.textContent = '';
      imageCell.append(picture);
      imageCell.className = 'cards-card-image';
    } else if (imageCell) {
      imageCell.querySelectorAll('picture > img').forEach((img) => {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        img.closest('picture').replaceWith(optimizedPic);
      });
      imageCell.className = imageCell.querySelector('picture, img') ? 'cards-card-image' : 'cards-card-body';
    }

    bodyCells.forEach((cell) => { cell.className = 'cards-card-body'; });
    li.append(imageCell, ...bodyCells);
    ul.append(li);
  });

  block.replaceChildren(ul);
}
