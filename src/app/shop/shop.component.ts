import { Component, OnInit } from '@angular/core';
import { ShopService } from '../core/shop.service';
import { Product } from '../core/product.model';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})

export class ShopComponent implements OnInit {

  productList: Product[];

  constructor(private shopService: ShopService) {

  }

  ngOnInit(): void {
    this.productList = this.shopService.getProductList();    
  }




}
