import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

function withWidth(url, width) {
  try {
    const u = new URL(url);
    u.searchParams.set('width', width);
    return u.toString();
  } catch {
    return url;
  }
}

function buildResponsivePicture(dmUrl) {
  const picture = document.createElement('picture');

  // Tablet / Desktop: ≥ 600px (card is ~300–400px in the grid)
  const wide = document.createElement('source');
  wide.media = '(min-width: 600px)';
  wide.srcset = `${withWidth(dmUrl, 400)} 1x, ${withWidth(dmUrl, 800)} 2x`;
  picture.append(wide);

  // Mobile fallback — card is nearly full viewport width
  const img = document.createElement('img');
  img.src = withWidth(dmUrl, 430);
  img.srcset = `${withWidth(dmUrl, 430)} 1x, ${withWidth(dmUrl, 860)} 2x`;
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
