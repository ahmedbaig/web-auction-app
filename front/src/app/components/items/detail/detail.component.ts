import { Component, OnInit, ɵSWITCH_TEMPLATE_REF_FACTORY__POST_R3__ } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { getOrigin } from 'src/app/origin';
import { BidsService } from 'src/app/services/bids.service';
import { ItemsService } from 'src/app/services/items.service';
import Swal from "sweetalert2"
import * as moment from "moment";
declare var $: any;
@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  itemId: string = "";
  item: any;
  bids: any[] = [];
  user: string;
  page: number = 1
  botMax: number = 0;
  amount: number = 0;
  origin: String = getOrigin()
  constructor(private $bidService: BidsService, private $ItemService: ItemsService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    if (localStorage.getItem("session") == "true") {
      this.user = sessionStorage.getItem("user");
    } else {
      this.user = sessionStorage.getItem("user");
    }
    this.route.params.subscribe(params => {
      this.itemId = params.id
      this.getBids(this.itemId)
    })
  }

  getBids(itemId: string) {
    this.$ItemService.getItem(itemId).subscribe(itemResponse => {
      if (itemResponse.success) {
        this.item = itemResponse.item[0];
        this.bids = itemResponse.item[0].bids.reverse();
        this.bids.forEach(bid => {
          bid.createdDate = moment(bid.createdDate).format("LLL")
        })
        this.amount = this.bids.length > 0 ? this.bids[0].amount + 1 : this.item.price + 1;
        this.item.image = `${this.origin}/resources-images/${this.item.image}`
      } else {
        Swal.fire("Opps..", itemResponse.msg, "error")
      }
    }, error => {
      Swal.fire("Opps..", error.error.msg, "error")
    })
  }

  bidNow() {
    if ((this.bids.length > 0 && this.amount < this.bids[0].amount) || (this.bids.length == 0 && this.amount < this.item.price)) {
      Swal.fire("Opps..", "Cannot bid lower than current value", "error")
      return;
    }
    let body = {
      user: this.user,
      item: this.itemId,
      amount: this.amount
    }
    this.$bidService.postBid(body).subscribe(bidResponse => {
      if (bidResponse.success) {
        this.$bidService.bidBotFire(this.itemId).subscribe(autoBidResponse => {
          console.log(autoBidResponse)
          this.getBids(this.itemId)
        }, error => {
          Swal.fire("Opps..", error.error.msg, "error")
        })
        Swal.fire("Success", bidResponse.msg, "success")
      } else {
        Swal.fire("Opps..", bidResponse.msg, "error")
      }
    }, error => {
      Swal.fire("Opps..", error.error.msg, "error")
    })
  }

  botConfigure() {
    this.$bidService.botEnable(this.user, this.itemId).subscribe(botResponse => {
      if (botResponse.success) {
        Swal.fire("Success", botResponse.msg, "success")
      } else {
        $('#botSettings').modal('toggle');
      }
    }, error => {
      Swal.fire("Opps..", error.error.msg, "error")
      $('#botSettings').modal('toggle');
    }
    )
  }

  openBotSettingsModel() {
    $('#botSettings').modal('toggle');
  }

  saveBotSettings() {
    this.$bidService.botSettings(this.user, this.botMax).subscribe(
      botResponse => {
        if (botResponse.success) {
          $('#botSettings').modal('toggle');
          Swal.fire("Success", botResponse.msg, "success")
        } else {
          Swal.fire("Opps..", botResponse.msg, "error")
        }
      }, error => {
        Swal.fire("Opps..", error.error.msg, "error")
      }
    )
  }
}
