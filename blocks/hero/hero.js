export default function decorate(block) {
  const rows = [...block.children];
  const [imageRow, altRow, ...contentRows] = rows;

  const anchor = imageRow?.querySelector('a[href]');
  const imageUrl = anchor?.href || imageRow?.querySelector('img')?.src || '';

  if (imageUrl) {
    const altText = altRow?.querySelector('div')?.textContent?.trim() || '';
    const img = document.createElement('img');
    img.src = imageUrl;
    img.alt = altText;
    img.loading = 'eager';
    imageRow.textContent = '';
    imageRow.append(img);
  }

  if (altRow) altRow.remove();
  contentRows.forEach((row) => row.classList.add('hero-content'));
}
