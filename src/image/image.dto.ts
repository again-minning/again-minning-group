import { Image } from '../entities/image';

export class ImageDto {
  constructor(image: Image) {
    this.imageId = image.imageId;
    this.url = image.url;
    this.createdAt = image.createdAt;
  }
  imageId: number;
  url: string;
  createdAt: Date;
}
