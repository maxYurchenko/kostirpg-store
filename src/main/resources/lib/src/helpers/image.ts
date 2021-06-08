const contentLib = __non_webpack_require__("/lib/xp/content");
const portal = __non_webpack_require__("/lib/xp/portal");
const utils = __non_webpack_require__("/lib/util");

import { Content, MediaImage } from "enonic-types/content";
import { ImageScale } from "enonic-types/portal";

export { getImage };

function getImage(id?: string, size?: ImageScale | null): Image {
  if (!size) {
    size = "max(1366)";
  }
  if (!id) {
    return getPlaceholder();
  }
  var image: Content<MediaImage> | null = contentLib.get({ key: id });
  if (!image) {
    return getPlaceholder();
  }
  return {
    url: portal.imageUrl({
      id: id,
      scale: size
    }),
    urlAbsolute: portal.imageUrl({
      id: id,
      scale: size,
      type: "absolute"
    }),
    alt: image.data.altText ? image.data.altText : "",
    caption: image.data.caption ? image.data.caption : "",
    artist: image.data.artist ? utils.data.forceArray(image.data.artist) : null,
    _id: image._id,
    placeholder: false
  };
}

function getPlaceholder() {
  return {
    url: portal.assetUrl({
      path: "images/default_avatar.png"
    }),
    urlAbsolute: portal.assetUrl({
      path: "images/default_avatar.png",
      type: "absolute"
    }),
    artist: null,
    alt: "City image",
    caption: "",
    placeholder: true,
    _id: null
  };
}

interface Image {
  url: string;
  urlAbsolute: string;
  artist: string[] | null;
  alt: string;
  caption: string;
  placeholder: boolean;
  _id: string | undefined | null;
}
