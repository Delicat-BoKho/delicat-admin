import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Content } from '../models/content';
import { Observable, combineLatest, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContentService {
  constructor(private fireStore: AngularFirestore) {}

  // GET: retrieve all contents
  getContents(): Observable<Content[]> {
    return this.fireStore
      .collection<Content>('Content')
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data() as Content;
            const id = a.payload.doc.id;
            return { ...data, id };
          })
        )
      );
  }

  // GET: retrieve content by id
  getContentById(id: string): Observable<Content | null> {
    return this.fireStore
      .collection<Content>('Content')
      .doc(id)
      .get()
      .pipe(
        map((doc) => {
          if (doc.exists) {
            const data = doc.data() as Content;
            return new Content(
              id,
              data.title,
              data.img,
              data.content,
              data.author,
              data.date
            );
          } else {
            console.log(
              'Cant find content by id: ' + id + '. Error at service.'
            );
            return null;
          }
        })
      );
  }

  // POST: create a new content
  createNewContent(newContent: Content): Promise<void> {
    const id = newContent.id;
    const content = { ...newContent };
    return this.fireStore.collection('Content').doc(id).set(content);
  }

  // PUT: update content
  updateContent(content: Content) {
    const currentContent = this.fireStore
      .collection<Content>('Content')
      .doc(content.id);
    const data = {
      id: content.id,
      title: content.title,
      img: content.img,
      content: content.content,
      author: content.author,
      date: content.date,
    };
    // push data
    currentContent
      .update(data)
      .then(() => {
        console.log('PUT service works!');
      })
      .catch((error) => {
        console.error('Erorr at updating service: ', error);
      });
  }

  // DELETE: delete content by id
  async deleteContentById(id: string) {
    const currentContent = this.fireStore
      .collection<Content>('Content')
      .doc(id);
    try {
      await currentContent.delete();
      console.log('DELETE service works!');
    } catch (error) {
      console.error('Error at deleting service: ', error);
    }
  }
}
