import { createOptimizedPicture } from '../../scripts/aem.js';
import { moveInstrumentation } from '../../scripts/scripts.js';

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
      const img = document.createElement('img');
      img.src = dmUrl;
      img.alt = textCells[0]?.querySelector('h2, h3')?.textContent?.trim() || '';
      img.loading = 'lazy';
      imageCell.textContent = '';
      imageCell.append(img);
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
