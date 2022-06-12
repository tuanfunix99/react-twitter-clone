
import { SnapshotDocumentMap } from 'react-hooks-firebase-v9';
import { Post } from '../base';

export const handleDisplayName = (name: string) => {
  return name.trim().split(" ").join("").trim();
};

export const convertBase64 = (file: File) => {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export async function dataURLtoFile(dataurl: string, filename: string) {
  const res = await fetch(dataurl);
  const blob = await res.blob();
  const file = new File([blob], filename,{ type: "image/png" })
  return file;
}

export const mapToPost = (snapshots: SnapshotDocumentMap<Omit<Post, "id">>[]) => {
  const posts: Post[] = [];
  snapshots.forEach(snapshot => {
    posts.push({
      id: snapshot.id,
      ...snapshot.data
    })
  })
  return posts;
}