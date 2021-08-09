import { Injectable } from '@angular/core';
import { AngularFireStorage } from "@angular/fire/storage";
import { map, finalize } from "rxjs/operators";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
    selectedFile: File = null;
    fb;
    downloadURL: Observable<string>;
    constructor(private storage: AngularFireStorage) { }
    
    onFileSelected(event) {
        return new Promise<any>((resolve, reject) =>{
            var n = Date.now();
            const file = event.target.files[0];
            const filePath = `listings/${n}`;
            const fileRef = this.storage.ref(filePath);
            const task = this.storage.upload(`listings/${n}`, file);
            task.snapshotChanges()
            .pipe(
                finalize(() => {
                this.downloadURL = fileRef.getDownloadURL();
                this.downloadURL.subscribe(url => {
                    if (url) {
                    this.fb = url;
                    resolve(this.fb);
                    }
                    
                });
                })
            )
            .subscribe(url => {
                if (url) {
                // resolve(url);
                // console.log(url)
                }
            });
        });
    }

}
