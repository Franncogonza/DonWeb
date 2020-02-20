import { Component, OnInit } from '@angular/core';
import { BaseService } from './service/base.service';
import { MatTableDataSource, MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  // title = 'DonWebCarrito';
  title = "Productos";
  titleService = '';
  planes: any;
  periodos: any;
  dataSource = new MatTableDataSource();
  renglonesTabla: any[] = [];
  displayedColumns: string[] = ['descripcion', 'plan', 'periodo', 'id', 'valor', 'delete'];
  json: any = [];
  hostingPlanName: any;
  hostingPLanPeriodo: any;
  webPlanName: any;
  webPlanPeriodos: any;
  periodoWebPlan: any;
  valorPeriodo: any;
  valorPlan: any
  webPlan: any;
  hostingPlan: any;
  product: any;
  idProduct: any;
  arrayProducts: any []; 
  cartProduct: any;
  productData: any;
  deleteProd: any;

  constructor(
    private _baseService: BaseService,
    public snackBar: MatSnackBar) { }

  ngOnInit() { }

  getHosting() {
    this._baseService.getPlanes().subscribe(
      (res: any) => {
        this.planes = res.response.planes;
        this.titleService = this.planes[0].nombre;
        this.valorPlan = this.planes[0].plan;
        this.periodos = this.planes[0].periodos;
      },
      (err) => {
        console.log(err);
        this.openSnackBar("Error de comunicacion con el ws");
      });
  }

  getWeb() {
    this._baseService.getPlanes().subscribe(
      (res: any) => {
        this.planes = res.response.planes;
        this.titleService = this.planes[1].nombre;
        this.valorPlan = this.planes[1].plan;
        this.periodos = this.planes[1].periodos;
      },
      (err) => {
        console.log(err);
        this.openSnackBar("Error de comunicacion con el ws");
      });
  }

  addProduct(periodo) {
    this.valorPeriodo = periodo;
    this._baseService.addProduct(this.valorPlan, this.valorPeriodo).subscribe(
      (res: any) => {
        this.idProduct = res.response.id_producto;
        console.log(this.idProduct);
        this.fillCart();
      },
      (err) => {
        console.log(err);
        this.openSnackBar("Error de comunicacion con el ws");
      });
  }

  fillCart() {
    this._baseService.shoppingCart().subscribe(
      (res: any) => {
        this.arrayProducts = res.response;
        console.log(this.arrayProducts);
        this.productData = this.arrayProducts.find(result => result.id_producto == this.idProduct);

        if (this.productData) {
          this.json = {
            'descripcion': this.productData.nombre,
            'plan': this.productData.plan,
            'periodo': this.productData.periodo,
            'id': this.productData.id_producto,
            'valor': this.productData.valor
          };

          this.renglonesTabla.push(this.json);
          this.dataSource = new MatTableDataSource(this.renglonesTabla);
        } else {
          this.openSnackBar("Producto no disponible");
        }
      },
      (err) => {
        console.log(err);
        this.openSnackBar("Error de comunicacion con el ws");
      });
  }

  deleteProduct(id_producto) {
    this._baseService.deleteProduct(id_producto).subscribe(
      (res: any) => {
        this.deleteProd = this.dataSource.data;

        for (var el in this.deleteProd) {
          var esteDelete = this.deleteProd[el];
          if (esteDelete.id == id_producto) {
            var indice = this.renglonesTabla.indexOf(esteDelete);
            if (indice >= 0) {
              this.renglonesTabla.splice(indice, 1);
            }
          }
        }
        this.dataSource = new MatTableDataSource(this.renglonesTabla);
      },
      (err) => {
        console.log(err);
        this.openSnackBar("Error de comunicacion con el ws");
      });
  }

  openSnackBar(message: string) {
    this.snackBar.open(message, "Cerrar", {
      duration: 3000,
    });
  }

}


