import { Component, OnInit, ɵSWITCH_TEMPLATE_REF_FACTORY__POST_R3__ } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getOrigin } from 'src/app/origin';
import { BidsService } from 'src/app/services/bids.service';
import { ItemsService } from 'src/app/services/items.service';
import Swal from "sweetalert2"
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  itemId: string = "";
  item: any;
  bids: any[];
  page: number = 1
  
  origin:String = getOrigin()
  constructor(private $bidService: BidsService, private $ItemService: ItemsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.itemId = params.id
      this.$ItemService.getItem(params.id).subscribe(itemResponse => {
        console.log(itemResponse);
        if (itemResponse.success) {
          this.item = itemResponse.item[0];
          this.bids = itemResponse.item[0].bids;

          this.item.image = `${this.origin}/resources-images/${this.item.image}`
        } else {
          Swal.fire("Opps..", itemResponse.msg, "error")
        }
      })
    })
  }

}
