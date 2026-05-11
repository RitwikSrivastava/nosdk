function buildResponsivePicture(dmUrl, altText) {
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
  img.alt = altText;
  img.loading = 'eager';
  picture.append(img);

  return picture;
}

export default function decorate(block) {
  const rows = [...block.children];
  const [imageRow, altRow, ...contentRows] = rows;

  const anchor = imageRow?.querySelector('a[href]');
  const imageUrl = anchor?.href || imageRow?.querySelector('img')?.src || '';

  if (imageUrl) {
    const altText = altRow?.querySelector('div')?.textContent?.trim() || '';
    const picture = buildResponsivePicture(imageUrl, altText);
    imageRow.textContent = '';
    imageRow.append(picture);
  }

  if (altRow) altRow.remove();
  contentRows.forEach((row) => row.classList.add('hero-content'));
}
