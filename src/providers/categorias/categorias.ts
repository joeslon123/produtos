// import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import 'rxjs/add/operator/map';
@Injectable()
export class CategoriasProvider {
private PATH = 'categorias/';


  constructor(private db:AngularFireDatabase) {

  }

  public getAll() {
    return this.db.list(this.PATH)
      .snapshotChanges()
      .map( changes => {
        return changes.map (m=> ({ key: m.key, ...m.payload.val() }))

      })
  }

  get() {

  }

  save() {

  }

  remove(){

  }

}
