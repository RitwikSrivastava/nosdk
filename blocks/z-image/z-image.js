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

function buildResponsivePicture(dmUrl, altText) {
  const picture = document.createElement('picture');

  // Desktop: ≥ 900px — image panel is 55% of viewport, ~800px
  const desktop = document.createElement('source');
  desktop.media = '(min-width: 900px)';
  desktop.srcset = `${withWidth(dmUrl, 800)} 1x, ${withWidth(dmUrl, 1600)} 2x`;
  picture.append(desktop);

  // Mobile fallback — stacked full width
  const img = document.createElement('img');
  img.src = withWidth(dmUrl, 430);
  img.srcset = `${withWidth(dmUrl, 430)} 1x, ${withWidth(dmUrl, 860)} 2x`;
  img.alt = altText;
  img.loading = 'lazy';
  picture.append(img);

  return picture;
}

export default function decorate(block) {
  [...block.children].forEach((row, i) => {
    const item = document.createElement('div');
    item.classList.add('z-image-item');
    item.classList.add(i % 2 === 0 ? 'z-image-item--normal' : 'z-image-item--reverse');
    moveInstrumentation(row, item);

    const [imageCell, ...textCells] = [...row.children];

    const anchor = imageCell?.querySelector('a[href]');
    const dmUrl = anchor?.href || '';

    if (dmUrl) {
      const altText = textCells[0]?.querySelector('h2, h3')?.textContent?.trim() || '';
      const picture = buildResponsivePicture(dmUrl, altText);
      imageCell.textContent = '';
      imageCell.append(picture);
    } else if (imageCell) {
      imageCell.querySelectorAll('picture > img').forEach((img) => {
        const optimizedPic = createOptimizedPicture(img.src, img.alt, false, [{ width: '750' }]);
        moveInstrumentation(img, optimizedPic.querySelector('img'));
        img.closest('picture').replaceWith(optimizedPic);
      });
    }
    imageCell.className = 'z-image-media';

    const textPanel = document.createElement('div');
    textPanel.className = 'z-image-text';
    textCells.forEach((cell) => {
      while (cell.firstChild) textPanel.append(cell.firstChild);
    });

    item.append(imageCell, textPanel);
    row.replaceWith(item);
  });
}
