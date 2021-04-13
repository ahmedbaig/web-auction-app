import { Component, OnInit } from '@angular/core';
import { getOrigin } from 'src/app/origin';
import { ItemsService } from 'src/app/services/items.service';
import * as _ from "lodash";
import { Router } from '@angular/router';
@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  items: any[] = []
  old_items: any[] = []
  page: number = 1
  origin:String = getOrigin()
  search:string = "";
  min:number;
  max:number;
  constructor(private $ItemsService:ItemsService,
    private router: Router) { }

  ngOnInit() {
    this.$ItemsService.getItems().subscribe(itemsResponse=>{
      this.setImagesOnData(itemsResponse)
    })
  }

  setImagesOnData(data:any){ 
    this.items = data.items;
    this.old_items = data.items;
    this.items.forEach(item=>{
      item.image = `${this.origin}/resources-images/${item.image}`
    })
  }

  searchItem(){
    if(this.search!=""){
      this.$ItemsService.findItems(this.search).subscribe(searchResponse=>{
        this.setImagesOnData(searchResponse)
      })
    }
  } 

  applyPriceFilter(){  
    this.items = _.filter(this.old_items, (item)=>{ return item.price >= this.min && item.price <= this.max})
  }
  
  resetPriceFilter(){
    this.items = _.clone(this.old_items)
  }

}
