//  import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FirebaseApp } from 'angularfire2';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

@Injectable()
export class ProdutosProvider {
  private PATH = 'produtos/';
  private PATH_IMG = 'img/';


  constructor(private fb: FirebaseApp, private db: AngularFireDatabase) {}

  getAll() {
    return this.db.list(this.PATH, ref => ref.orderByChild('categoryName'))
      .snapshotChanges()
      .map(changes => {
        return changes.map(m => ({ key: m.key, data: m.payload.val() }));
      });
  }

  get(categoriaKey:string) {
    return this.db.object(this.PATH + categoriaKey)
    .snapshotChanges()
    .map(m => {
      return {key: m.key, ...m.payload.val()}

    });
  }

// file é o arquivo passando por parâmetro
save(item: any, file: File) {
  const product = {
    name: item.name,
    description: item.description,
    imgUrl: item.imgUrl,
    price: item.price,
    categoryKey: item.categoryKey,
    categoryName: item.categoryName
  };

  if (item.key) {
    this.db.object(this.PATH + item.key).update(product).then(() => {
      // quando o usuário clicar pra salvar eu salvo a imagem e se salvou com sucesso (then) e daí fazer o upload da imagem
      // Se não ficaria assim: this.db.object(this.PATH + item.key).update(product);
      if (file) {
        this.uploadImg(item.key, file);
      }
    });
  } else {                                // a partir do then tenho na variavel result o resultado da inclusão e pego a key que foi incluída...
    this.db.list(this.PATH).push(product).then((result: any) => {
      if (file) {
        this.uploadImg(result.key, file);
      }
    });
  }
}





uploadImg(key: string, file: File) {
  const storageRef = this.fb.storage().ref();              // put(file) adicionando o arquivo
  const uploadTask = storageRef.child(this.PATH_IMG + key).put(file);
                                            // quando o status mudar... implementar 3 métodos
                                            // snapshot, error e quando tiver finalizado
  uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
    (snapshot: any) => {
      // upload em andamento
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    },
    (error) => {
      // upload falhou
      console.log(error);
    },
    () => {
      // upload com sucesso, update estou usando somente uma parte do registro
                                                        //uploadTask pego a propriedade downloadURL que é caminho do storage gravado da imagem
      this.db.object(this.PATH + key).update({ imgUrl: uploadTask.snapshot.downloadURL });
    }
  );
}


remove(produtokey: string, removeImg: boolean) {
  removeImg=false,
  this.db.list(this.PATH).remove(produtokey).then(() => {
    if (removeImg) {
      this.removeImg(produtokey);
    }
  });
}

private removeImg(produtokey: string) {
  const storageRef = this.fb.storage().ref();
  storageRef.child(this.PATH_IMG + produtokey).delete();
}

removeImgOfProduct(produtokey: string) {
  this.removeImg(produtokey);
  this.db.object(this.PATH + produtokey).update({ imgUrl: '' });
}

// Atualizar nome da Categoria no Cadastro de Produtos...
updateCategories(categoryKey: string, categoryName: string) {
                                 // fazendo uma consulta no Produtos com essa categoria
  const subscribe = this.db.list(this.PATH, ref => ref.orderByChild('categoryKey').equalTo(categoryKey))
    .snapshotChanges()
    .map(changes => {
      return changes.map(m => ({ key: m.key }));
    })          // neste subscrite Eu recebi a key do produto
    .subscribe(items => {
      subscribe.unsubscribe();

      items.forEach(product => {
        this.db.object(this.PATH + product.key).update({
          categoryKey: categoryKey,
          categoryName: categoryName
        });
      });
    });
}




}
