import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { ProdutosProvider } from './../../../providers/produtos/produtos';
import { Observable } from 'rxjs/observable'



@IonicPage()
@Component({
  selector: 'page-produtos-lista',
  templateUrl: 'produtos-lista.html',
})
export class ProdutosListaPage {
  produtos: Observable<any[]>;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private toast: ToastController,
    private produtosProvider: ProdutosProvider) {

this.produtos = this.produtosProvider.getAll();
}

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProdutosEditaPage');
  }
  newItemProdutos(){
    this.navCtrl.push('ProdutosEditaPage')
  }

  editItemProdutos(produtos:any){
    this.navCtrl.push('ProdutosEditaPage', { produtokey: produtos.key} )


  }

  removeItemProdutos(produtoKey: string, hasImg: boolean) {
    this.produtosProvider.remove(produtoKey, hasImg);
    this.toast.create({
      message: "Produto removido com sucesso",
      duration:3000,
      position: 'bottom'})
      .present();

  }

}
