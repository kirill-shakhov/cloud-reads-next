export const IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
] as const;

export const BOOK_DOCUMENT_MIME_TYPES = [
  'application/epub+zip',
  'application/x-mobipocket-ebook',
  'application/vnd.amazon.ebook',
  'application/pdf',
  'application/x-fictionbook+xml',
  'text/plain',
  'text/html',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
] as const;

export const BOOK_FILE_EXTENSION_TO_MIME_TYPE: Record<string, string> = {
  '.epub': 'application/epub+zip',
  '.mobi': 'application/x-mobipocket-ebook',
  '.azw': 'application/vnd.amazon.ebook',
  '.pdf': 'application/pdf',
  '.fb2': 'application/x-fictionbook+xml',
  '.txt': 'text/plain',
  '.html': 'text/html',
  '.doc': 'application/msword',
  '.docx':
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
};

export const DEFAULT_FILE_MIME_TYPE = 'application/octet-stream';
