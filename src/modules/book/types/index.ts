export interface Book {
  _id: string;
  title: string;
  image: string;
  book: string;
  genre: {
    name: string;
  };
  author: {
    name: string;
  };
}

export interface UploadBookData {
  title: string;
  genreName: string;
  authorName: string;
  image: File | null;
  book: File | null;
}
