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

  // Desktop: ≥ 900px — full-width hero
  const desktop = document.createElement('source');
  desktop.media = '(min-width: 900px)';
  desktop.srcset = `${withWidth(dmUrl, 1440)} 1x, ${withWidth(dmUrl, 2880)} 2x`;
  picture.append(desktop);

  // Tablet: ≥ 600px
  const tablet = document.createElement('source');
  tablet.media = '(min-width: 600px)';
  tablet.srcset = `${withWidth(dmUrl, 750)} 1x, ${withWidth(dmUrl, 1500)} 2x`;
  picture.append(tablet);

  // Mobile fallback
  const img = document.createElement('img');
  img.src = withWidth(dmUrl, 430);
  img.srcset = `${withWidth(dmUrl, 430)} 1x, ${withWidth(dmUrl, 860)} 2x`;
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
