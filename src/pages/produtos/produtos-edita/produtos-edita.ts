import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoriasProvider } from './../../../providers/categorias/categorias';
import { ProdutosProvider } from './../../../providers/produtos/produtos';
import { Subscriber } from 'rxjs';
import { Observable } from 'rxjs/observable'

@IonicPage()
@Component({
  selector: 'page-produtos-edita',
  templateUrl: 'produtos-edita.html',
})

export class ProdutosEditaPage {
  title: string;
  // formulário para a pagina edita.html
  form: FormGroup;
  // para carregar as categorias
  categories: Observable<any[]>;
  // armazenar um produto
  produtos: any;
  hasImg = false;
  //buscar arquivos do celular
  private file: File = null;

  // armazenar uma categoria
  categoriaItem:any;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              private formBuilder: FormBuilder,
              private toast: ToastController,
              private produtosProvider: ProdutosProvider,
              private categoriasProvider: CategoriasProvider)

{


                //guarda a chave do produto que será editado
                this.produtos = this.navParams.data.produtoKey || {};
                 console.log(this.produtos);

                this.SetupPageTitle();

                //cria o formulário para jogar
                this.createForm();


                //busca todas as categorias
                this.loadCategories();

                const subscribe = this.produtosProvider.get(this.navParams.data.produtoKey).subscribe((produtosData: any) => {
                  subscribe.unsubscribe();
                  this.produtos = produtosData;
                  console.log(this.produtos);
                });

                // inicia como se não houve imagem ainda...
                this.hasImg = this.produtos.imgUrl != '';

  }

  private SetupPageTitle(){
    if(this.navParams.data.produtoKey){
      this.title="Alterando Produto";
    } else {
      this.title="Novo Produto"
    }

  }

  private createForm(){
    this.form = this.formBuilder.group({
      key: [this.produtos.key],
      name: [this.produtos.name, Validators.required],
      description: [this.produtos.description],
      price: [this.produtos.price, Validators.required],
      categoryKey: [this.produtos.categoryKey, Validators.required],
      categoryName: [this.produtos.categoryName],
      imgUrl: [this.produtos.imgUrl],
      img:[this.produtos.img],
    })
  }

  //Salva o produto e mostra a mensagem que o produto foi salvo.
  onSubmit(){
    if (this.form.valid) {
      this.produtosProvider.save(this.form.value, this.file);
      this.toast.create({
        message: "Produto salvo com sucesso!!",
          duration:3000,
          position: 'bottom'})
          .present();
      // this.toast.create({ message: 'Produto salva com sucesso', duration: 3000}).present();
      this.navCtrl.pop();
    }
  }

  // consulta todas as categorias e carrega em um Observable   (consulta no banco)
  private loadCategories() {
    this.categories = this.categoriasProvider.getAll();
  }

  // consulta a categoria escolhida pela key e guarda o nome
  getCategorias() {
    const subscribe = this.categoriasProvider.get(this.form.value.categoryKey).subscribe((categoriasData: any) => {
      subscribe.unsubscribe();
      this.categoriaItem = categoriasData;
      console.log(this.categoriaItem);
      this.form.controls['categoryName'].setValue(this.categoriaItem.name);
      console.log(this.categoriaItem.name);
    });
  }

  // inserir a imagem para o produto
  fileEvent(fileInput: any) {
    this.file = null;

    if (fileInput.target.files.length) {
      this.file = fileInput.target.files[0];
      this.form.controls['img'].updateValueAndValidity();

      if (['image/png', 'image/jpeg'].indexOf(this.file.type) < 0) {
        this.form.controls['img'].setErrors({ 'imgType': true });
      }
    }
  }

  // remove a imagem
  removeImg() {
    this.form.controls['imgUrl'].setValue('');
    this.hasImg = false;
    if (this.form.value.key) {
      this.produtosProvider.removeImgOfProduct(this.form.value.key);
    }
  }




}
