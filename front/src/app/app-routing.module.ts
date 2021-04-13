import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { BotComponent } from './components/bot/bot.component';
import { DetailComponent } from './components/items/detail/detail.component';
import { ListComponent } from './components/items/list/list.component';
import { LoginComponent } from './components/login/login.component';


const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [ 
      { path: 'items', component: ListComponent },
      { path: 'items/:id', component: DetailComponent },
      { path: 'bot', component: BotComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
