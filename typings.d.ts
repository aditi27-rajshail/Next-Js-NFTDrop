interface Image {
  asset: {
    url: string;
  };
}

export interface Creator {
  _id: string;
  name: string;
  address: string;
  bio: string;
  slug: {
    current: string;
  };
  image: Image;
}

export interface Collection {
  _id: string;
  title: string;
  address: string;
  description: string;
  nfCollectionName: string;
  slug: {
    current: string;
  };
  mainImage: Image;
  previewImage: Image;
  creator: Creator;
}
